export function bytesHumanize(bytes: number, multiplier = 1024) {
    bytes = Math.abs(bytes);
    const index = Math.floor(Math.log(bytes) / Math.log(multiplier)),
        units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    var value = (bytes / Math.pow(multiplier, index)) * 1;
    var unit = units[index];

    if (unit === 'Bytes' && (value === 0 || value === 1)) {
        unit = unit.slice(0, -1);
    }

    if (!unit) return bytes.toString();
    return value.toFixed(2) + ' ' + unit;
}