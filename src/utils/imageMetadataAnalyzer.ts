// Client-side image metadata analysis for AI threat detection

export interface ImageAnalysisResult {
  isSuspicious: boolean;
  riskScore: number; // 0-100
  issues: string[];
  metadata: {
    hasExif: boolean;
    creationDate?: string;
    modificationDate?: string;
    device?: string;
    software?: string;
    location?: boolean;
    dimensions?: { width: number; height: number };
    fileSize?: number;
    format?: string;
  };
  recommendations: string[];
}

/**
 * Analyze image file for suspicious metadata patterns
 */
export async function analyzeImageMetadata(file: File): Promise<ImageAnalysisResult> {
  let riskScore = 0;
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Basic file info
  const fileSize = file.size;
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop() || '';

  // Check file type
  const validImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];
  if (!validImageTypes.includes(fileExtension)) {
    issues.push('Unsupported image format');
    recommendations.push('Use standard image formats (JPG, PNG) for better analysis');
  }

  // Check file size (very small or very large can be suspicious)
  if (fileSize < 1000) {
    riskScore += 10;
    issues.push('Unusually small file size - may be placeholder or low quality');
  }
  if (fileSize > 50 * 1024 * 1024) {
    riskScore += 5;
    issues.push('Very large file size - may indicate high resolution or manipulation');
  }

  // Try to extract EXIF data
  let exifData: any = null;
  try {
    const exifrModule = await import('exifr');
    const exifr = exifrModule.default || exifrModule;
    exifData = await exifr.parse(file, {
      pick: [
        'DateTimeOriginal',
        'ModifyDate',
        'CreateDate',
        'Make',
        'Model',
        'Software',
        'GPSLatitude',
        'GPSLongitude',
        'ImageWidth',
        'ImageHeight',
        'Orientation'
      ]
    });
  } catch (error) {
    // EXIF extraction failed - this is common for web images
    issues.push('No EXIF metadata found - common for web-shared images');
    recommendations.push('Images shared on social media often have metadata removed');
  }

  const metadata: ImageAnalysisResult['metadata'] = {
    hasExif: !!exifData,
    fileSize,
    format: fileExtension.toUpperCase(),
  };

  // Analyze EXIF data if available
  if (exifData) {
    // Check for creation date anomalies
    if (exifData.DateTimeOriginal) {
      metadata.creationDate = exifData.DateTimeOriginal;
      const creationDate = new Date(exifData.DateTimeOriginal);
      const now = new Date();
      const ageInDays = (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24);

      // Future dates are suspicious
      if (creationDate > now) {
        riskScore += 30;
        issues.push('Creation date is in the future - likely metadata manipulation');
        recommendations.push('This image has been modified or has incorrect metadata');
      }

      // Very recent images (created today) from unknown sources
      if (ageInDays < 1) {
        riskScore += 5;
        issues.push('Image created very recently');
      }
    }

    // Check for device/software info
    if (exifData.Make && exifData.Model) {
      metadata.device = `${exifData.Make} ${exifData.Model}`;
    }

    if (exifData.Software) {
      metadata.software = exifData.Software;
      
      // Suspicious software indicators
      const suspiciousSoftware = [
        'photoshop', 'gimp', 'paint.net', 'affinity', 'corel',
        'deepfake', 'face swap', 'neural', 'ai', 'generator'
      ];
      const softwareLower = exifData.Software.toLowerCase();
      if (suspiciousSoftware.some(s => softwareLower.includes(s))) {
        riskScore += 20;
        issues.push(`Image edited with: ${exifData.Software}`);
        recommendations.push('This image was processed with editing software');
      }
    }

    // Check for GPS location (privacy concern, not necessarily AI threat)
    if (exifData.GPSLatitude && exifData.GPSLongitude) {
      metadata.location = true;
      riskScore += 5;
      issues.push('Image contains GPS location data');
      recommendations.push('Consider removing location data before sharing images');
    }

    // Check dimensions
    if (exifData.ImageWidth && exifData.ImageHeight) {
      metadata.dimensions = {
        width: exifData.ImageWidth,
        height: exifData.ImageHeight
      };

      // Unusual aspect ratios can be suspicious
      const aspectRatio = exifData.ImageWidth / exifData.ImageHeight;
      if (aspectRatio < 0.5 || aspectRatio > 2.0) {
        riskScore += 5;
        issues.push('Unusual image dimensions or aspect ratio');
      }
    }
  } else {
    // No EXIF data - common for web images, but can indicate manipulation
    riskScore += 5;
    recommendations.push('No metadata available - image may have been processed or stripped');
  }

  // Check image dimensions from file (if EXIF not available)
  try {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        if (!metadata.dimensions) {
          metadata.dimensions = {
            width: img.width,
            height: img.height
          };
        }
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      img.src = objectUrl;
    });
  } catch (error) {
    issues.push('Could not determine image dimensions');
  }

  // Generate recommendations based on findings
  if (riskScore >= 50) {
    recommendations.push('⚠️ This image shows signs of potential manipulation or suspicious metadata');
    recommendations.push('Verify the source of this image before trusting it');
    recommendations.push('Consider using reverse image search to check if this image appears elsewhere');
  } else if (riskScore >= 30) {
    recommendations.push('Exercise caution with this image');
    recommendations.push('Verify the source and context');
  } else {
    recommendations.push('Image metadata appears normal, but always verify sources');
    recommendations.push('When in doubt, use reverse image search tools');
  }

  return {
    isSuspicious: riskScore >= 50,
    riskScore: Math.min(100, riskScore),
    issues,
    metadata,
    recommendations
  };
}

/**
 * Get risk level from score
 */
export function getImageRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 70) return 'critical';
  if (riskScore >= 50) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
}
