import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Carousel, Input, Button } from "antd";
import { useRef, useState } from "react";

const SpeakerCarousel = ({
  noOfSpeakers,
  setSpeakerValue,
  handleSpeakerAudioPlay,
}: any) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with the first speaker
  const carouselRef = useRef<any>(null);

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleAfterChange = (current: number) => {
    setCurrentIndex(current + 1); // Update index (0-based to 1-based)
  };

  return (
    <div className="bg-black rounded-lg p-4 text-center">
      <div className="text-white mb-4 text-lg">
        Speaker {currentIndex}/{noOfSpeakers.length}
      </div>
      <Carousel
        ref={carouselRef}
        dots={false} // Hide default dots
        draggable
        afterChange={handleAfterChange}
        className="rounded-lg"
      >
        {noOfSpeakers?.map((item: any, index: number) => (
          <div key={index} className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4 w-full justify-center">
              <Input
                value={`${item}` || ""} // Pre-fill with the current value for the speaker, or empty string if not set
                placeholder={`Enter ${item} name`}
                style={{
                  backgroundColor: "#1A1A1A",
                  color: "#FFF",
                  border: "none",
                }}
                onChange={(e) => {
                  setSpeakerValue((prev: any[]) => ({
                    ...prev,
                    [item]: e.target.value,
                  }));
                }}
              />
              <Button
                className="bg-blue-500 text-white-1 hover:bg-blue-600 border-none"
                onClick={() => handleSpeakerAudioPlay(item)}
              >
                Play Audio
              </Button>
            </div>
          </div>
        ))}
      </Carousel>
      <div className="flex justify-between mt-4">
        {/* Previous Button */}
        <div className="flex-1">
          <Button
            className="text-white-1 hover:text-white-2 border-none w-full"
            style={{
              display: currentIndex === 1 ? "none" : "block", // Hide "Previous" when on the first speaker
            }}
            onClick={handlePrev}
            disabled={currentIndex === 1} // Disable if on the first speaker
          >
            <ChevronLeftIcon className="h-5 w-5" /> {/* Left Arrow Icon */}
          </Button>
        </div>

        {/* Next Button */}
        <div className="flex-1 text-right">
          <Button
            className="text-white-1 hover:text-white-2 border-none w-full"
            style={{
              display: currentIndex === noOfSpeakers.length ? "none" : "block", // Hide "Next" when on the last speaker
            }}
            onClick={handleNext}
            disabled={currentIndex === noOfSpeakers.length} // Disable if on the last speaker
          >
            <div className="flex justify-end w-full">
              <ChevronRightIcon className="h-5 w-5" /> {/* Right Arrow Icon */}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpeakerCarousel;
