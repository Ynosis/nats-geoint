```mermaid
graph TD;
PullRawSat[Service\nPull satellite raw data]
RawObjectStore[(NATS ObjectStore\nraw-data-from-satellites\nbucket)]
ConvertTiffJobBuffer>NATS JetStream\nsatellites.jobs.raw-to-tiffs]
ConvertVideosToTiff[Service\nConvert raw to tiffs]
TiffsFromSatellitesObjectStore[(NATS ObjectStore\ntiffs-from-satellites\nbucket)]
MakeWebFriendly[Service\nMake web friendly\nweb images\nand thumbnails]
WebFriendlySatellitesObjectStore>NATS JetStream\nweb-satellites-data]
WebFriendlyJobBuffer>NATS JetStream\nprocess-tiffs]

PullRawSat-->RawObjectStore
PullRawSat-->ConvertTiffJobBuffer
PullRawSat-->|size/name|MetadataKV
ConvertTiffJobBuffer-->ConvertVideosToTiff
RawObjectStore-->ConvertVideosToTiff
ConvertVideosToTiff-->WebFriendlyJobBuffer
ConvertVideosToTiff-->TiffsFromSatellitesObjectStore
ConvertVideosToTiff-->|resolution/frameCount|MetadataKV
TiffsFromSatellitesObjectStore-->MakeWebFriendly-->WebFriendlySatellitesObjectStore
WebFriendlyJobBuffer-->MakeWebFriendly
MakeWebFriendly-->|url/thumbnail|MetadataKV

WebFriendlySatellitesObjectStore-->BrowserA[/BrowserA\]
MetadataKV-->BrowserA[/BrowserA\]
WebFriendlySatellitesObjectStore-->BrowserB[/BrowserB\]
MetadataKV-->BrowserB[/BrowserB\]
WebFriendlySatellitesObjectStore-->BrowserC[/BrowserC\]
MetadataKV-->BrowserC[/BrowserC\]
WebFriendlySatellitesObjectStore-->BrowserD[/BrowserD\]
MetadataKV-->BrowserD[/BrowserD\]

```