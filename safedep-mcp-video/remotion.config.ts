import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// For better quality
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");