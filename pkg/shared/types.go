package shared

import "encoding/json"

type SatelliteMetadata struct {
	ID                uint64 `json:"id"`
	InitialSourceURL  string `json:"initialSourceURL"`
	ShouldBeProcessed bool   `json:"shouldBeProcessed"`

	PullFromFeed struct {
		WasCached bool `json:"wasCached"`
		Bytes     int  `json:"bytes"`
	} `json:"pullFromFeed"`

	HiRez struct {
		OrginalResolutionWidth  int `json:"orginalResolutionWidth"`
		OrginalResolutionHeight int `json:"orginalResolutionHeight"`
		FrameCount              int `json:"frameCount"`
		LastFrameProcessed      int `json:"lastFrameProcessed"`
	} `json:"hiRez"`

	WebFriendly struct {
		Width              int `json:"width"`
		Height             int `json:"height"`
		FrameCount         int `json:"frameCount"`
		LastFrameProcessed int `json:"lastFrameProcessed"`
	} `json:"webFriendly"`
}

type SatelliteMetadataStage struct {
	Name               string
	ProgressPercentage int
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
