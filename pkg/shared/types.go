package shared

import (
	"fmt"

	"github.com/goccy/go-json"
)

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
		ThumbnailWidth     int `json:"thumbnailWidth"`
		ThumbnailHeight    int `json:"thumbnailHeight"`
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

type SatelliteImageryDiffRequest struct {
	VideoFeedID uint64 `json:"videoFeedID"`
	StartFrame  int    `json:"startFrame"`
	EndFrame    int    `json:"endFrame"`
}

func SatelliteImageryDiffRequestFromJSON(b []byte) (*SatelliteImageryDiffRequest, error) {
	s := &SatelliteImageryDiffRequest{}
	if err := json.Unmarshal(b, s); err != nil {
		return nil, fmt.Errorf("can't unmarshal satellite imagery diff request: %w", err)
	}
	return s, nil
}

type SatelliteImageryDiffSuccessResponse struct {
	AverageDistance    int `json:"averageDistance"`
	DifferenceDistance int `json:"differenceDistance"`
	PerceptionDistance int `json:"perceptionDistance"`
}

type SatelliteImageryDiffResponse struct {
	Error   string                              `json:"error"`
	Success SatelliteImageryDiffSuccessResponse `json:"success"`
}

func (res *SatelliteImageryDiffResponse) MustToJSON() []byte {
	b, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}
	return b
}
