// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import uuid from 'uuid/v4';

import BaseConverter from './base-converter';
import {loadLidarData} from '../parsers/parse-lidar-points';

// load file
export default class LidarConverter extends BaseConverter {
  constructor(rootDir, streamDir, {disabledStreams = []} = {}) {
    super(rootDir, streamDir);

    this.LIDAR_POINTS = '/lidar/points';

    this.disabled = disabledStreams
      .map(pattern => RegExp(pattern).test(this.LIDAR_POINTS))
      .some(x => x === true);
  }

  async convertFrame(frameNumber, xvizBuilder) {
    if (this.disabled) {
      return;
    }

    const {data} = await this.loadFrame(frameNumber);
    const lidarData = loadLidarData(data);

    // This encode/parse is a temporary workaround until we get fine-grain
    // control of which streams should be packed in the binary.
    // By doing this we are able to have the points converted to the appropriate
    // TypedArray, and by unpacking them, they are in a JSON structure that
    // works better with the rest of the conversion.
    const temporaryObject = {vertices: lidarData.positions};

    xvizBuilder
      .stream(this.LIDAR_POINTS)
      .points(temporaryObject.vertices)
      .id(uuid())
      .style({
        color: [0, 0, 0, 255]
      });
  }

  getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream(this.LIDAR_POINTS)
      .category('primitive')
      .type('point')
      .styleClassDefault({
        fillColor: '#00a',
        radiusPixels: 2
      })
      // laser scanner relative to GPS position
      // http://www.cvlibs.net/datasets/kitti/setup.php
      .pose({
        x: 0.81,
        y: -0.32,
        z: 1.73
      });
  }
}
