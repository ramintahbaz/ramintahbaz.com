#!/usr/bin/env node

/**
 * Video Compression Script
 * Compresses videos in public/videos/ directory for web playback
 * 
 * Requirements:
 * - ffmpeg must be installed: brew install ffmpeg (on macOS)
 * 
 * Usage:
 *   npm run compress-videos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');
const BACKUP_DIR = path.join(process.cwd(), 'public', 'videos', 'backup');

// Video compression settings optimized for web
const COMPRESSION_SETTINGS = {
  // H.264 codec with good quality/size balance
  codec: 'libx264',
  // CRF (Constant Rate Factor): 23 is a good balance (lower = better quality, larger file)
  // Range: 18-28, where 18 is nearly lossless and 28 is very compressed
  crf: '23',
  // Preset: medium is a good balance between speed and compression
  preset: 'medium',
  // Audio codec
  audioCodec: 'aac',
  // Audio bitrate
  audioBitrate: '128k',
  // Video bitrate (optional, CRF is usually better)
  // maxrate: '2M',
  // bufsize: '4M',
};

function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ ffmpeg is not installed!');
    console.error('\nTo install ffmpeg:');
    console.error('  macOS: brew install ffmpeg');
    console.error('  Linux: sudo apt-get install ffmpeg');
    console.error('  Windows: Download from https://ffmpeg.org/download.html\n');
    process.exit(1);
  }
}

function getVideoFiles() {
  const files = fs.readdirSync(VIDEOS_DIR);
  return files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);
    })
    .map(file => path.join(VIDEOS_DIR, file));
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function compressVideo(inputPath, outputPath) {
  const inputSize = getFileSize(inputPath);
  console.log(`\n📹 Compressing: ${path.basename(inputPath)}`);
  console.log(`   Original size: ${formatFileSize(inputSize)}`);

  const ffmpegCommand = [
    'ffmpeg',
    '-i', `"${inputPath}"`,
    '-c:v', COMPRESSION_SETTINGS.codec,
    '-crf', COMPRESSION_SETTINGS.crf,
    '-preset', COMPRESSION_SETTINGS.preset,
    '-c:a', COMPRESSION_SETTINGS.audioCodec,
    '-b:a', COMPRESSION_SETTINGS.audioBitrate,
    '-movflags', '+faststart', // Optimize for web streaming
    '-y', // Overwrite output file
    `"${outputPath}"`
  ].join(' ');

  try {
    execSync(ffmpegCommand, { stdio: 'inherit' });
    
    const outputSize = getFileSize(outputPath);
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
    
    console.log(`   ✅ Compressed size: ${formatFileSize(outputSize)}`);
    console.log(`   📉 Size reduction: ${reduction}%`);
    
    return { original: inputSize, compressed: outputSize, reduction };
  } catch (error) {
    console.error(`   ❌ Error compressing ${path.basename(inputPath)}:`, error.message);
    return null;
  }
}

function createBackup(filePath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  
  console.log(`   💾 Creating backup: ${fileName}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function main() {
  console.log('🎬 Video Compression Script\n');
  console.log('This script will compress videos for web playback.');
  console.log('Original videos will be backed up to public/videos/backup/\n');

  // Check if ffmpeg is installed
  checkFFmpeg();

  // Get all video files
  const videoFiles = getVideoFiles();
  
  if (videoFiles.length === 0) {
    console.log('❌ No video files found in public/videos/');
    process.exit(1);
  }

  console.log(`Found ${videoFiles.length} video file(s) to compress:\n`);
  videoFiles.forEach(file => {
    const size = formatFileSize(getFileSize(file));
    console.log(`  - ${path.basename(file)} (${size})`);
  });

  console.log('\n⚠️  This will compress videos in place (originals will be backed up).');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  // Wait 3 seconds
  setTimeout(() => {
    let totalOriginal = 0;
    let totalCompressed = 0;

    videoFiles.forEach((videoPath) => {
      // Create backup
      createBackup(videoPath);
      
      // Create temporary output path
      const tempPath = videoPath + '.compressed';
      
      // Compress
      const result = compressVideo(videoPath, tempPath);
      
      if (result) {
        totalOriginal += result.original;
        totalCompressed += result.compressed;
        
        // Replace original with compressed version
        fs.renameSync(tempPath, videoPath);
      } else {
        // If compression failed, remove temp file
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    });

    console.log('\n' + '='.repeat(50));
    console.log('📊 Compression Summary:');
    console.log(`   Original total: ${formatFileSize(totalOriginal)}`);
    console.log(`   Compressed total: ${formatFileSize(totalCompressed)}`);
    console.log(`   Total reduction: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`);
    console.log(`\n✅ Done! Original videos backed up to: ${BACKUP_DIR}`);
    console.log('='.repeat(50) + '\n');
  }, 3000);
}

main();









