// Image Metadata Analyzer Component
// Analyzes image files for suspicious metadata patterns

import React, { useState } from 'react';
import { Image, Upload, AlertTriangle, ShieldCheck, XCircle, Info } from 'lucide-react';
import { analyzeImageMetadata, getImageRiskLevel } from '../../utils/imageMetadataAnalyzer';
import { mapImageAnalysisToAlert } from '../../mappers/imageToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';
import { consumeFreeUse } from '../../config/products';
import Paywall from '../common/Paywall';

const ImageMetadataAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAlert = useCautionStore((s) => s.addAlert);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Check and consume free use if available
      const hadFreeUse = consumeFreeUse('ai_image_analyzer');
      
      const analysis = await analyzeImageMetadata(file);
      setResult(analysis);

      // Show message if free use was consumed (optional - can be a toast notification)
      if (hadFreeUse) {
        // Free use consumed - user will see paywall on next use
        console.log('Free use consumed. Upgrade to Standard Plan for unlimited access.');
      }

      // Create alert if suspicious
      if (analysis.isSuspicious) {
        const alert = mapImageAnalysisToAlert(analysis, { id: `img-${Date.now()}`, fileName: file.name });
        if (alert) {
          addAlert(alert);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const riskLevel = result ? getImageRiskLevel(result.riskScore) : null;

  // Free preview (header and description)
  const freePreview = (
    <>
      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Image Metadata Analyzer
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Upload an image to analyze its metadata for signs of manipulation or suspicious patterns.
            </p>
          </div>
          {/* Privacy Notice */}
          <div className="flex items-start justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-3xl mx-auto">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Privacy First:</strong> All analysis happens in your browser. Your image never leaves your device.
            </p>
          </div>
        </div>
      </section>
    </>
  );

  // Locked content (the actual tool)
  const lockedContent = (
    <>
      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4 mb-6">
        {!preview ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-purple-600 hover:text-purple-700 font-medium">
                Click to upload an image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF, WebP up to 50MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                aria-label="Clear image"
                title="Clear image"
              >
                <XCircle className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className={`border-2 rounded-xl p-6 ${
          result.isSuspicious
            ? result.riskScore >= 70
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
            : 'border-green-500 bg-green-50 dark:bg-green-900/20'
        }`}>
          <div className="flex items-center mb-4">
            {result.isSuspicious ? (
              <AlertTriangle className={`h-8 w-8 mr-3 ${
                result.riskScore >= 70 ? 'text-red-600' : 'text-orange-600'
              }`} />
            ) : (
              <ShieldCheck className="h-8 w-8 text-green-600 mr-3" />
            )}
            <div>
              <h3 className="text-xl font-bold">
                {result.isSuspicious ? (
                  <span className={result.riskScore >= 70 ? 'text-red-900 dark:text-red-200' : 'text-orange-900 dark:text-orange-200'}>
                    {result.riskScore >= 70 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'}
                  </span>
                ) : (
                  <span className="text-green-900 dark:text-green-200">✓ Low Risk</span>
                )}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Risk Score: <strong>{result.riskScore}%</strong> ({riskLevel})
              </p>
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Detected Issues:</h4>
              <ul className="space-y-1">
                {result.issues.map((issue: string, i: number) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                    <span className="text-gray-800 dark:text-gray-200">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata Info */}
          <div className="mb-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Metadata Information:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">EXIF Data:</span>{' '}
                <span className="font-medium">{result.metadata.hasExif ? 'Yes' : 'No'}</span>
              </div>
              {result.metadata.dimensions && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>{' '}
                  <span className="font-medium">{result.metadata.dimensions.width} × {result.metadata.dimensions.height}</span>
                </div>
              )}
              {result.metadata.format && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Format:</span>{' '}
                  <span className="font-medium">{result.metadata.format}</span>
                </div>
              )}
              {result.metadata.fileSize && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">File Size:</span>{' '}
                  <span className="font-medium">{(result.metadata.fileSize / 1024).toFixed(1)} KB</span>
                </div>
              )}
              {result.metadata.device && (
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Device:</span>{' '}
                  <span className="font-medium">{result.metadata.device}</span>
                </div>
              )}
              {result.metadata.software && (
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Software:</span>{' '}
                  <span className="font-medium">{result.metadata.software}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recommendations:</h4>
            <ul className="space-y-1 text-sm">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-gray-800 dark:text-gray-200">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Educational Footer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 What to look for:</h3>
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>• Missing or manipulated EXIF metadata</li>
          <li>• Future dates in creation timestamps</li>
          <li>• Editing software signatures</li>
          <li>• Unusual dimensions or file sizes</li>
          <li>• Always verify images through reverse image search</li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Paywall
        productId="ai_image_analyzer"
        freePreview={freePreview}
        lockedContent={lockedContent}
        customTitle="Unlock AI Image Analyzer"
        customBody="Get access to advanced image metadata analysis to detect manipulation and suspicious patterns. Included in Standard Plan."
      />
    </div>
  );
};

export default ImageMetadataAnalyzer;
