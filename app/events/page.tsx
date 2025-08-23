"use client";
import { getEvents, getPastEventImages } from "lib/shopify";
import type { EventDets, PastEventDets } from "lib/shopify/types";
import { useEffect, useState } from "react";

const fetchEventDets = async () => {
  const eventDets = await getEvents();
  return eventDets;
};

const fetchPastEventsData = async () => {
  const pastEventDets = await getPastEventImages();
  return pastEventDets;
};

const Page = () => {
  const [events, setEvents] = useState<EventDets[]>([]);
  const [pastEventImages, setPastEventImages] = useState<PastEventDets[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetchEventDets();
      const pastEventDets = await fetchPastEventsData();
      setPastEventImages(pastEventDets);
      setEvents(res);
    };
    fetchImages();
  }, []);

  return (
    <div className="container py-10 font-primary">
      <h1 className="primary-heading">Events</h1>
      <h1 className="primary-heading text-4xl w-full text-center">
        Book Signings and Author Talks
      </h1>

      <div className="mt-8">
        <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>
        <div className="flex flex-col gap-12">
          {events.map((event, idx) => (
            <div key={event.id || idx} className="flex h-[32vh] gap-6">
              {/* Event Image */}
              <div className="w-[16vw] h-full flex-shrink-0 bg-gray-100 flex items-center justify-center">
                {event.image && event.image.url ? (
                  <img
                    src={event.image.url}
                    alt={event.image.altText || event.name || "Event image"}
                    className="object-cover w-full h-full shadow-xl rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    ?
                  </div>
                )}
              </div>
              {/* Event Details */}
              <div className="flex flex-col gap-20 h-full w-full">
                <div className="flex flex-col gap-4">
                  <h2 className="font-semibold text-lg mb-1">{event.name}</h2>
                  <p className="mb-2 text-gray-700 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-base mt-1 font-semibold">
                    {event.date
                      ? new Date(event.date).toLocaleString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </div>
              {/* Book Now Button */}
              <div className="flex h-full whitespace-nowrap w-fit items-end">
                <a
                  href={event.book_now || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-white font-semibold py-4 px-6 h-fit rounded-full transition-colors text-lg leading-none"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h1 className="text-2xl font-semibold mb-4">Past Events</h1>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {pastEventImages.map((item, i) => (
            <div key={i} className="mb-4 rounded-lg overflow-hidden">
              <img src={item.url} alt={item.altText} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
