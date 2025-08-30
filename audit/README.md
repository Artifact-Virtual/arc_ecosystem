# Audit Scripts

This directory contains automated audit and reporting tools for the ARC ecosystem.

## Directory Structure

```
audit/
├── reports/          # Generated audit reports (always saved here)
├── scripts/          # Audit generation scripts
└── README.md         # This file
```

## Audit Report Generator

The `generate-report.ts` script automatically generates comprehensive audit reports in the `reports/` directory.

### Features

- ✅ **Fixed Output Directory**: Always generates reports in `audit/reports/`
- ✅ **Automatic Directory Creation**: Creates the reports directory if it doesn't exist
- ✅ **Timestamped Reports**: Each report includes generation timestamp
- ✅ **Error Handling**: Comprehensive error handling with user feedback
- ✅ **Unique Filenames**: Reports are saved with unique timestamps to avoid conflicts

### Usage

#### Via NPM Script (Recommended)
```bash
npm run audit:generate
```

#### Direct Execution
```bash
npx ts-node audit/scripts/generate-report.ts
```

### Generated Report Format

Reports are saved as Markdown files with the following structure:

```markdown
# Audit Report Version {version}

**Generated:** {timestamp}

{content}

---

**Signed:** audit-{version}-{timestamp}.md
```

### Integration with CI/CD

The script is designed to work seamlessly with automated CI/CD pipelines:

- Reports are always saved to a consistent location
- Unique filenames prevent conflicts in parallel executions
- Console output provides clear success/failure feedback
- Error handling ensures pipeline reliability

### Example Output

When run, the script will:
1. Ensure the `audit/reports/` directory exists
2. Generate a timestamped report file (e.g., `audit-1725030000000.md`)
3. Display success message with the report location

### Customization

To customize the report content, modify the `sampleContent` variable in the script or create a separate script that calls the `AuditReportGenerator` class with your specific content.

### Dependencies

- Node.js >= 18.0.0
- TypeScript
- File system access (for writing reports)

### Error Handling

The script includes comprehensive error handling for:
- Directory creation failures
- File write failures
- Invalid input parameters
- Permission issues

All errors are logged to console with clear error messages.
