#!/bin/bash
ffmpeg -i test2.mp4 -filter:v "crop=640:640" -c:a copy hivid.mp4
