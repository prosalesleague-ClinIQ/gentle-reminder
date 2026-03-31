import { Audio } from 'expo-av';

/**
 * Audio recording configuration optimized for voice capture.
 */
const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

/**
 * Request audio recording permissions.
 * @returns true if permissions were granted.
 */
export async function requestAudioPermissions(): Promise<boolean> {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    if (granted) {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    }
    return granted;
  } catch {
    return false;
  }
}

/**
 * Start a new audio recording.
 * @returns The recording instance, or null if recording failed to start.
 */
export async function startRecording(): Promise<Audio.Recording | null> {
  try {
    const hasPermission = await requestAudioPermissions();
    if (!hasPermission) return null;

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(RECORDING_OPTIONS);
    await recording.startAsync();
    return recording;
  } catch {
    return null;
  }
}

/**
 * Stop a recording and get the file URI.
 * @returns The local file URI of the recording, or null on failure.
 */
export async function stopRecording(
  recording: Audio.Recording,
): Promise<string | null> {
  try {
    await recording.stopAndUnloadAsync();
    // Reset audio mode so playback works
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
    return recording.getURI();
  } catch {
    return null;
  }
}

/**
 * Play an audio file from a URI.
 * @returns The sound object for controlling playback.
 */
export async function playAudio(uri: string): Promise<Audio.Sound | null> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
    );
    return sound;
  } catch {
    return null;
  }
}

/**
 * Get the duration of a recording in seconds.
 */
export async function getRecordingDuration(
  recording: Audio.Recording,
): Promise<number> {
  try {
    const status = await recording.getStatusAsync();
    return status.isRecording ? Math.floor(status.durationMillis / 1000) : 0;
  } catch {
    return 0;
  }
}
