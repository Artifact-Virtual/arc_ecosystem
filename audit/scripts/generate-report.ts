// This file contains functions for generating audit reports, including formatting and signing functionalities.

import fs from 'fs';
import path from 'path';

export class AuditReportGenerator {
    private readonly AUDIT_REPORTS_DIR = path.resolve(__dirname, '..', 'reports');

    constructor() {
        // Always use the fixed audit reports directory
        this.ensureReportsDirectory();
    }

    public generateReport(version: string, content: string): void {
        try {
            const reportContent = this.formatReport(version, content);
            this.saveReport(reportContent);
            console.log(`✅ Audit report generated successfully in: ${this.AUDIT_REPORTS_DIR}`);
        } catch (error) {
            console.error('❌ Failed to generate audit report:', error);
            throw error;
        }
    }

    private formatReport(version: string, content: string): string {
        const timestamp = new Date().toISOString();
        return `# Audit Report Version ${version}\n\n**Generated:** ${timestamp}\n\n${content}\n\n---\n\n**Signed:** audit-${version}-${Date.now()}.md`;
    }

    private saveReport(content: string): void {
        const filename = `audit-${Date.now()}.md`;
        const fullPath = path.join(this.AUDIT_REPORTS_DIR, filename);
        fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
    }

    private ensureReportsDirectory(): void {
        try {
            if (!fs.existsSync(this.AUDIT_REPORTS_DIR)) {
                fs.mkdirSync(this.AUDIT_REPORTS_DIR, { recursive: true });
                console.log(`📁 Created audit reports directory: ${this.AUDIT_REPORTS_DIR}`);
            }
        } catch (error) {
            console.error('❌ Failed to create audit reports directory:', error);
            throw error;
        }
    }

    public getReportsDirectory(): string {
        return this.AUDIT_REPORTS_DIR;
    }
}

// Usage example and main execution
if (require.main === module) {
    // Example usage when run directly
    const generator = new AuditReportGenerator();

    const sampleContent = `
## Security Audit Summary

### Findings
- ✅ Access control mechanisms properly implemented
- ✅ Reentrancy protection in place
- ✅ Input validation comprehensive
- ⚠️ Gas optimization opportunities identified

### Recommendations
1. Implement additional monitoring
2. Consider upgrade patterns for future contracts
3. Regular security audits recommended

### Risk Assessment
- Critical: 0
- High: 1
- Medium: 3
- Low: 5
- Informational: 12
    `;

    try {
        generator.generateReport('v1.0.0', sampleContent);
        console.log(`📋 Audit report generated in: ${generator.getReportsDirectory()}`);
    } catch (error) {
        console.error('Failed to generate sample report:', error);
        process.exit(1);
    }
}