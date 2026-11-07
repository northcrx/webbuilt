/* Lightweight standalone ZIP archive generator (PKZIP 2.0).
   Works in modern browsers without external dependencies. */
(function () {
  var S = window.Studio = window.Studio || {};
  S.exporters = S.exporters || {};

  var crcTable = null;
  function getCrcTable() {
    if (crcTable) return crcTable;
    var table = new Uint32Array(256);
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    crcTable = table;
    return table;
  }

  function crc32(uint8) {
    var table = getCrcTable();
    var crc = 0xFFFFFFFF;
    for (var i = 0; i < uint8.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ uint8[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  var encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
  function stringToBytes(str) {
    if (encoder) return encoder.encode(str);
    var arr = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i) & 0xFF;
    }
    return arr;
  }

  function writeUInt16LE(arr, offset, val) {
    arr[offset] = val & 0xFF;
    arr[offset + 1] = (val >>> 8) & 0xFF;
  }

  function writeUInt32LE(arr, offset, val) {
    arr[offset] = val & 0xFF;
    arr[offset + 1] = (val >>> 8) & 0xFF;
    arr[offset + 2] = (val >>> 16) & 0xFF;
    arr[offset + 3] = (val >>> 24) & 0xFF;
  }

  function createZipUint8Array(files) {
    var localParts = [];
    var cdParts = [];
    var offset = 0;
    var fileCount = 0;

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (!f || !f.path) continue;
      var rawPath = String(f.path).replace(/\\/g, '/').replace(/^\/+/, '');
      var pathBytes = stringToBytes(rawPath);
      var contentBytes;
      if (typeof f.content === 'string') {
        contentBytes = stringToBytes(f.content);
      } else if (f.content instanceof Uint8Array) {
        contentBytes = f.content;
      } else {
        contentBytes = stringToBytes(String(f.content || ''));
      }

      var crc = crc32(contentBytes);
      var size = contentBytes.length;

      // Local Header: 30 bytes
      var lh = new Uint8Array(30);
      writeUInt32LE(lh, 0, 0x04034b50); // Local file header signature
      writeUInt16LE(lh, 4, 20);         // Version needed: 2.0
      writeUInt16LE(lh, 6, 0x0800);     // General purpose bit flag: UTF-8
      writeUInt16LE(lh, 8, 0);          // Compression method: 0 (store)
      writeUInt16LE(lh, 10, 0x4800);    // Time: 09:00:00
      writeUInt16LE(lh, 12, 0x5821);    // Date: 2024-01-01
      writeUInt32LE(lh, 14, crc);       // CRC-32
      writeUInt32LE(lh, 18, size);      // Compressed size
      writeUInt32LE(lh, 22, size);      // Uncompressed size
      writeUInt16LE(lh, 26, pathBytes.length); // File name length
      writeUInt16LE(lh, 28, 0);         // Extra field length

      localParts.push(lh);
      localParts.push(pathBytes);
      localParts.push(contentBytes);

      // Central Directory Header: 46 bytes
      var cd = new Uint8Array(46);
      writeUInt32LE(cd, 0, 0x02014b50); // Central directory header signature
      writeUInt16LE(cd, 4, 20);         // Version made by: 2.0
      writeUInt16LE(cd, 6, 20);         // Version needed: 2.0
      writeUInt16LE(cd, 8, 0x0800);     // General purpose bit flag: UTF-8
      writeUInt16LE(cd, 10, 0);         // Compression method: 0
      writeUInt16LE(cd, 12, 0x4800);    // Time
      writeUInt16LE(cd, 14, 0x5821);    // Date
      writeUInt32LE(cd, 16, crc);       // CRC-32
      writeUInt32LE(cd, 20, size);      // Compressed size
      writeUInt32LE(cd, 24, size);      // Uncompressed size
      writeUInt16LE(cd, 28, pathBytes.length); // File name length
      writeUInt16LE(cd, 30, 0);         // Extra field length
      writeUInt16LE(cd, 32, 0);         // Comment length
      writeUInt16LE(cd, 34, 0);         // Disk number start
      writeUInt16LE(cd, 36, 0);         // Internal file attributes
      writeUInt32LE(cd, 38, 0x81A40000); // External file attributes (regular file 0644)
      writeUInt32LE(cd, 42, offset);    // Relative offset of local header

      cdParts.push(cd);
      cdParts.push(pathBytes);

      offset += 30 + pathBytes.length + size;
      fileCount++;
    }

    var cdStart = offset;
    var cdSize = 0;
    for (var j = 0; j < cdParts.length; j++) {
      cdSize += cdParts[j].length;
    }

    // End of Central Directory: 22 bytes
    var eocd = new Uint8Array(22);
    writeUInt32LE(eocd, 0, 0x06054b50);
    writeUInt16LE(eocd, 4, 0); // Disk number
    writeUInt16LE(eocd, 6, 0); // Central directory start disk
    writeUInt16LE(eocd, 8, fileCount);  // Total records on this disk
    writeUInt16LE(eocd, 10, fileCount); // Total records
    writeUInt32LE(eocd, 12, cdSize);    // Size of central directory
    writeUInt32LE(eocd, 16, cdStart);   // Offset of central directory
    writeUInt16LE(eocd, 20, 0);         // Comment length

    var totalSize = offset + cdSize + 22;
    var result = new Uint8Array(totalSize);
    var pos = 0;

    for (var k = 0; k < localParts.length; k++) {
      result.set(localParts[k], pos);
      pos += localParts[k].length;
    }
    for (var m = 0; m < cdParts.length; m++) {
      result.set(cdParts[m], pos);
      pos += cdParts[m].length;
    }
    result.set(eocd, pos);

    return result;
  }

  S.exporters.Zip = {
    create: function (files) {
      var bytes = createZipUint8Array(files);
      if (typeof Blob !== 'undefined') {
        return new Blob([bytes], { type: 'application/zip' });
      }
      return bytes;
    },

    download: function (files, filename) {
      filename = filename || 'DroidLab-Android-Project.zip';
      var blob = this.create(files);
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }
  };
})();
