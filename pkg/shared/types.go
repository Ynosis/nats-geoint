package shared

import "encoding/json"

type SatelliteMetadata struct {
	ID                      uint64 `json:"id"`
	InitialSourceURL        string `json:"initialSourceURL"`
	FrameCount              int    `json:"frameCount"`
	LastFrameProcessed      int    `json:"lastFrameProcessed"`
	OrginalResolutionWidth  int    `json:"orginalResolutionWidth"`
	OrginalResolutionHeight int    `json:"orginalResolutionHeight"`
}

func MustSatelliteMetadataFromJSON(b []byte) *SatelliteMetadata {
	s := &SatelliteMetadata{}
	if err := json.Unmarshal(b, s); err != nil {
		panic(err)
	}
	return s
}

func (s *SatelliteMetadata) MustToJSON() []byte {
	b, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}
	return b
}
