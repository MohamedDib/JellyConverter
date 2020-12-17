#!/bin/bash
ffmpeg -i test2.mp4 -filter:v "crop=in_w/3:in_h/1" -c:a copy test.mp4
