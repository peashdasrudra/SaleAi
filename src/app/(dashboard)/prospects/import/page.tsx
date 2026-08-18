'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { importProspects } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function ImportProspectsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [options, setOptions] = useState({
    defaultCountry: 'US',
    skipDuplicates: true,
    markUncertain: true
  });
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const prospectFields = [
    { value: 'company_name', label: 'Company Name *' },
    { value: 'email', label: 'Email' },
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'job_title', label: 'Job Title' },
    { value: 'country', label: 'Country' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        alert('Please select a valid CSV file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const parseCsv = () => {
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const detectedHeaders = results.meta.fields || [];
        setHeaders(detectedHeaders);
        setCsvData(results.data);
        
        const initialMapping: Record<string, string> = {};
        detectedHeaders.forEach(header => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('company')) initialMapping[header] = 'company_name';
          else if (lowerHeader.includes('email')) initialMapping[header] = 'email';
          else if (lowerHeader.includes('first')) initialMapping[header] = 'first_name';
          else if (lowerHeader.includes('last')) initialMapping[header] = 'last_name';
          else if (lowerHeader.includes('title')) initialMapping[header] = 'job_title';
          else if (lowerHeader.includes('country')) initialMapping[header] = 'country';
          else initialMapping[header] = 'skip';
        });
        setFieldMapping(initialMapping);
        setStep(2);
      }
    });
  };

  const handleImport = async () => {
    setIsImporting(true);
    setStep(4);
    try {
      const res = await importProspects({
        rows: csvData,
        fieldMapping,
        options
      });
      setResults(res);
    } catch (e: any) {
      alert('Import failed: ' + e.message);
      setStep(3);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Import Prospects</h1>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload CSV</CardTitle>
            <CardDescription>Upload your prospect list in CSV format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Compliance Warning</AlertTitle>
              <AlertDescription>
                Ensure you have permission to contact these prospects in accordance with local regulations.
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="mb-4">Drag and drop your CSV file here, or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Browse files
                </label>
              </Button>
            </div>
            
            {file && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-gray-400">({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button onClick={parseCsv} disabled={!file}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Map Fields</CardTitle>
            <CardDescription>Match your CSV columns to the appropriate fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {headers.map(header => (
                <div key={header} className="grid grid-cols-2 gap-4 items-center p-4 border rounded">
                  <div>
                    <h4 className="font-medium">{header}</h4>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      Sample: {csvData[0]?.[header] || ''}
                    </p>
                  </div>
                  <div>
                    <Select
                      value={fieldMapping[header]}
                      onValueChange={(val) => setFieldMapping(prev => ({ ...prev, [header]: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skip">Skip this column</SelectItem>
                        {prospectFields.map(f => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Options & Preview</CardTitle>
            <CardDescription>Review your settings before importing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold">Import Options</h3>
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium w-32">Default Country</label>
                <Select
                  value={options.defaultCountry}
                  onValueChange={(val) => setOptions(prev => ({ ...prev, defaultCountry: val }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skip-duplicates"
                  checked={options.skipDuplicates}
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, skipDuplicates: c as boolean }))}
                />
                <label htmlFor="skip-duplicates" className="text-sm font-medium leading-none">
                  Skip duplicate records based on email
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mark-uncertain"
                  checked={options.markUncertain}
                  onCheckedChange={(c) => setOptions(prev => ({ ...prev, markUncertain: c as boolean }))}
                />
                <label htmlFor="mark-uncertain" className="text-sm font-medium leading-none">
                  Mark uncertain prospects for review
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleImport}>Import {csvData.length} Records</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isImporting ? (
              <div className="py-12 text-center space-y-4">
                <p>Importing records...</p>
                <Progress value={45} className="w-[60%] mx-auto" />
              </div>
            ) : results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{results.imported}</div>
                    <div className="text-sm text-green-600">Imported</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-700">{results.skipped}</div>
                    <div className="text-sm text-yellow-600">Skipped</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded border border-red-200">
                    <div className="text-2xl font-bold text-red-700">{results.rejected}</div>
                    <div className="text-sm text-red-600">Rejected</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">{results.flaggedForReview}</div>
                    <div className="text-sm text-blue-600">Flagged</div>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="border border-red-200 rounded p-4">
                    <h4 className="font-semibold text-red-700 mb-2">Errors</h4>
                    <ul className="text-sm space-y-1 text-red-600 max-h-40 overflow-y-auto">
                      {results.errors.map((e: any, idx: number) => (
                        <li key={idx}>Row {e.row}: {e.reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button asChild>
                    <a href="/prospects">View Prospects</a>
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setFile(null);
                    setStep(1);
                    setResults(null);
                  }}>Import More</Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
