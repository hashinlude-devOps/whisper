import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Carousel, Button } from "antd";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

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
    setCurrentIndex(current + 1); // Update currentIndex based on active slide
  };

  return (
    <div className="bg-black rounded-lg p-4 text-center">
      <div className="text-white mb-4 text-lg">
        Speaker {currentIndex}/{noOfSpeakers.length}
      </div>
      <Carousel
        ref={carouselRef}
        dots={false}
        draggable
        afterChange={handleAfterChange}
        className="rounded-lg"
      >
        {noOfSpeakers?.map((item: string, index: number) => (
          <div key={index} className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4 w-full justify-center">
              <Input
                placeholder={`Enter ${item} name`}
                onChange={(e) => {
                  setSpeakerValue((prev: any) => ({
                    ...prev,
                    [item]: e.target.value, // Use the current speaker name as the key
                  }));
                }}
              />
              <Button
                className="text-white-1 border-none bg-blue-600 hover:bg-blue-700"
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
          {currentIndex > 1 && (
            <div
              className="text-white-1 hover:text-white-2 border-none w-full"
              onClick={handlePrev}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="flex-1 text-right">
          {currentIndex < noOfSpeakers.length && (
            <div
              className="text-white-1 hover:text-white-2 border-none w-full"
              onClick={handleNext}
            >
              <div className="flex justify-end w-full">
                <ChevronRightIcon className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerCarousel;
