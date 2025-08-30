#!/usr/bin/env node

/**
 * Gas Optimization Script for ARC Ecosystem
 * Analyzes and optimizes contracts for sub-cent transaction fees
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GasOptimizer {
    constructor() {
        this.contractsDir = path.join(__dirname, '..', 'contracts');
        this.reportsDir = path.join(__dirname, '..', 'gas-reports');
        this.ensureReportsDir();
    }

    ensureReportsDir() {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    async analyzeContracts() {
        console.log('🔍 Analyzing contracts for gas optimization opportunities...');

        const contracts = this.findSolidityFiles();
        const analysis = {
            timestamp: new Date().toISOString(),
            contracts: [],
            recommendations: [],
            totalSavings: 0
        };

        for (const contract of contracts) {
            const result = await this.analyzeContract(contract);
            analysis.contracts.push(result);

            if (result.savings > 0) {
                analysis.totalSavings += result.savings;
            }
        }

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis.contracts);

        this.saveAnalysis(analysis);
        this.printSummary(analysis);

        return analysis;
    }

    findSolidityFiles() {
        const files = [];

        function scanDir(dir) {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDir(fullPath);
                } else if (item.endsWith('.sol')) {
                    files.push(fullPath);
                }
            }
        }

        scanDir(this.contractsDir);
        return files;
    }

    async analyzeContract(contractPath) {
        const content = fs.readFileSync(contractPath, 'utf8');
        const relativePath = path.relative(this.contractsDir, contractPath);

        const analysis = {
            path: relativePath,
            name: path.basename(contractPath, '.sol'),
            lines: content.split('\n').length,
            functions: [],
            savings: 0,
            issues: []
        };

        // Analyze for gas optimization opportunities
        analysis.issues = this.analyzeGasIssues(content);
        analysis.savings = this.calculateSavings(analysis.issues);

        return analysis;
    }

    analyzeGasIssues(content) {
        const issues = [];

        // Check for inefficient patterns
        if (content.includes('for (uint256 i = 0; i < ')) {
            issues.push({
                type: 'unchecked_loop',
                severity: 'medium',
                savings: 200,
                description: 'Consider using unchecked arithmetic in loops'
            });
        }

        if (content.includes('require(') && content.includes('&&')) {
            issues.push({
                type: 'multiple_require',
                severity: 'low',
                savings: 100,
                description: 'Multiple require statements can be combined'
            });
        }

        if (content.includes('storage') && content.includes('memory')) {
            issues.push({
                type: 'storage_to_memory',
                severity: 'high',
                savings: 500,
                description: 'Consider using memory instead of storage where possible'
            });
        }

        if (content.includes('public') && !content.includes('view') && !content.includes('pure')) {
            issues.push({
                type: 'unnecessary_public',
                severity: 'low',
                savings: 50,
                description: 'Consider using external instead of public for better gas efficiency'
            });
        }

        if (content.includes('emit ') && content.includes('indexed')) {
            const indexedCount = (content.match(/indexed/g) || []).length;
            if (indexedCount > 3) {
                issues.push({
                    type: 'too_many_indexed',
                    severity: 'medium',
                    savings: 300,
                    description: 'Too many indexed parameters in events'
                });
            }
        }

        return issues;
    }

    calculateSavings(issues) {
        return issues.reduce((total, issue) => total + issue.savings, 0);
    }

    generateRecommendations(contracts) {
        const recommendations = [];

        const totalFunctions = contracts.reduce((sum, c) => sum + c.functions.length, 0);
        const totalSavings = contracts.reduce((sum, c) => sum + c.savings, 0);

        if (totalSavings > 1000) {
            recommendations.push({
                priority: 'high',
                action: 'Implement comprehensive gas optimizations',
                expectedSavings: totalSavings,
                description: 'Multiple optimization opportunities identified'
            });
        }

        const uncheckedLoops = contracts.filter(c =>
            c.issues.some(i => i.type === 'unchecked_loop')
        ).length;

        if (uncheckedLoops > 0) {
            recommendations.push({
                priority: 'medium',
                action: 'Add unchecked arithmetic to loops',
                expectedSavings: uncheckedLoops * 200,
                description: 'Use unchecked for loop counters to save gas'
            });
        }

        const storageIssues = contracts.filter(c =>
            c.issues.some(i => i.type === 'storage_to_memory')
        ).length;

        if (storageIssues > 0) {
            recommendations.push({
                priority: 'high',
                action: 'Optimize storage usage',
                expectedSavings: storageIssues * 500,
                description: 'Replace storage with memory where appropriate'
            });
        }

        return recommendations;
    }

    saveAnalysis(analysis) {
        const filename = `gas-analysis-${Date.now()}.json`;
        const filepath = path.join(this.reportsDir, filename);

        fs.writeFileSync(filepath, JSON.stringify(analysis, null, 2));
        console.log(`💾 Analysis saved to: ${filepath}`);
    }

    printSummary(analysis) {
        console.log('\n📊 Gas Optimization Analysis Summary');
        console.log('=' .repeat(50));
        console.log(`📁 Contracts analyzed: ${analysis.contracts.length}`);
        console.log(`💰 Total potential savings: ${analysis.totalSavings} gas`);
        console.log(`🎯 High priority issues: ${analysis.recommendations.filter(r => r.priority === 'high').length}`);
        console.log(`⚡ Medium priority issues: ${analysis.recommendations.filter(r => r.priority === 'medium').length}`);

        if (analysis.recommendations.length > 0) {
            console.log('\n🔧 Top Recommendations:');
            analysis.recommendations.slice(0, 3).forEach((rec, i) => {
                console.log(`${i + 1}. ${rec.action} (${rec.expectedSavings} gas savings)`);
            });
        }

        console.log('\n✅ Analysis complete!');
    }

    async runHardhatGasReport() {
        console.log('⛽ Running Hardhat gas report...');

        try {
            execSync('npm run gas-report', { stdio: 'inherit' });
            console.log('✅ Gas report generated successfully');
        } catch (error) {
            console.error('❌ Failed to generate gas report:', error.message);
        }
    }

    async optimizeBuild() {
        console.log('🔨 Running optimized compilation...');

        try {
            execSync('npm run gas:optimize', { stdio: 'inherit' });
            console.log('✅ Optimized build completed');
        } catch (error) {
            console.error('❌ Failed to run optimized build:', error.message);
        }
    }
}

// Main execution
async function main() {
    const optimizer = new GasOptimizer();

    console.log('🚀 ARC Ecosystem Gas Optimization Suite');
    console.log('=====================================');

    // Run analysis
    await optimizer.analyzeContracts();

    // Run gas report
    await optimizer.runHardhatGasReport();

    // Run optimized build
    await optimizer.optimizeBuild();

    console.log('\n🎉 Gas optimization process completed!');
    console.log('📈 Check gas-reports/ directory for detailed analysis');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = GasOptimizer;
