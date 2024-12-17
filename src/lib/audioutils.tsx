// export async function convertToWav(blob: Blob): Promise<Blob> {
//     if (blob.type === "audio/wav" || blob.type === "audio/ogg") {
//         return blob; // Return without conversion if it's already supported
//     }

//     const arrayBuffer = await blob.arrayBuffer();
//     const audioContext = new AudioContext();
//     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//     const wavBlob = audioBufferToWav(audioBuffer);
//     return wavBlob; // Return WAV
// }

  
//   function audioBufferToWav(buffer: AudioBuffer): Blob {
//     const numOfChannels = buffer.numberOfChannels;
//     const length = buffer.length * numOfChannels * 2 + 44;
//     const output = new ArrayBuffer(length);
//     const view = new DataView(output);
//     const channels = [];
//     let offset = 0;
//     let pos = 0;
  
//     // Write WAV file header
//     function writeString(view: DataView, offset: number, string: string) {
//       for (let i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i));
//       }
//     }
  
//     writeString(view, pos, "RIFF");
//     pos += 4;
//     view.setUint32(pos, 36 + buffer.length * numOfChannels * 2, true);
//     pos += 4;
//     writeString(view, pos, "WAVE");
//     pos += 4;
//     writeString(view, pos, "fmt ");
//     pos += 4;
//     view.setUint32(pos, 16, true);
//     pos += 4;
//     view.setUint16(pos, 1, true);
//     pos += 2;
//     view.setUint16(pos, numOfChannels, true);
//     pos += 2;
//     view.setUint32(pos, buffer.sampleRate, true);
//     pos += 4;
//     view.setUint32(pos, buffer.sampleRate * 4, true);
//     pos += 4;
//     view.setUint16(pos, numOfChannels * 2, true);
//     pos += 2;
//     view.setUint16(pos, 16, true);
//     pos += 2;
//     writeString(view, pos, "data");
//     pos += 4;
//     view.setUint32(pos, buffer.length * numOfChannels * 2, true);
//     pos += 4;
  
//     // Interleave audio channels
//     for (let i = 0; i < buffer.numberOfChannels; i++) {
//       channels.push(buffer.getChannelData(i));
//     }
  
//     while (pos < length) {
//       for (let i = 0; i < numOfChannels; i++) {
//         view.setInt16(
//           pos,
//           Math.max(-1, Math.min(1, channels[i][offset])) * 0x7fff,
//           true
//         );
//         pos += 2;
//       }
//       offset++;
//     }
  
//     return new Blob([output], { type: "audio/wav" });
//   }

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export async function convertToAac(blob: Blob): Promise<Blob> {
  const ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';

  // Load FFmpeg core scripts
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  try {
    // Write the input file to FFmpeg memory
    const inputFileName = 'input.audio';
    const outputFileName = 'output.aac';

    await ffmpeg.writeFile(inputFileName, await fetchFile(blob));

    // Execute FFmpeg command for AAC conversion
    await ffmpeg.exec([
      '-i', inputFileName,    // Input file
      '-c:a', 'aac',          // Audio codec
      '-ac', '1',             // Mono channel
      '-ar', '16000',         // Sample rate
      '-b:a', '16k',          // Bitrate
      '-movflags', '+faststart', // Optimize for streaming
      outputFileName,         // Output file
    ]);

    // Read and return the output file
    const data = await ffmpeg.readFile(outputFileName);
    return new Blob([data], { type: 'audio/aac' });

  } catch (error) {
    console.error('Error during AAC conversion:', error);
    throw new Error('Error during AAC conversion');
  } finally {
    // Cleanup FFmpeg memory
    // ffmpeg.exit();
  }
}
