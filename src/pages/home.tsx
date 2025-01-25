import usePhoto3D from "../hooks/usePhoto3D.ts";
import {Fragment} from "react";
import Header from "../components/Header.tsx";
import {ArrowBack, ArrowForward, Search} from "@mui/icons-material";

const imageData = [
  {
    path: "/photography/preview/img1.jpg",
    title: "Sunset Over the Ocean",
    photographer: "John Doe",
    date: "2024-01-18",
    location: "California, USA",
    description: "A beautiful view of the sunset over the ocean horizon.",
  },
  {
    path: "/photography/preview/img2.jpg",
    title: "Mountain Adventure",
    photographer: "Jane Smith",
    date: "2023-12-05",
    location: "Swiss Alps, Switzerland",
    description: "A thrilling hike in the Swiss Alps.",
  },
  {
    path: "/photography/preview/img3.jpg",
    title: "City Lights",
    photographer: "Emily Brown",
    date: "2023-11-15",
    location: "New York City, USA",
    description: "A stunning view of the city skyline at night.",
  },
  {
    path: "/photography/preview/img4.jpg",
    title: "Forest Retreat",
    photographer: "Michael Lee",
    date: "2023-10-22",
    location: "Black Forest, Germany",
    description: "A peaceful retreat amidst the tall trees of the Black Forest.",
  },
];

export function Home() {
  const {next, previous, search, imagesState, imageTransforms, mainDivRef, setImagesState} = usePhoto3D(imageData);

  return (
    <Fragment>
      <div className="main-photodiv" ref={mainDivRef}>
        {imageTransforms.map((image: any, index: number) => {
          const page = index === imagesState.current ? (
            imagesState.current === imagesState.target ? 1 : 0.5
          ) : (
            imagesState.current === imagesState.target ? 0 : 0.5
          );
          const style = {
            ...(imagesState.isSearch ? {} : {opacity: page}),
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url('${image.path}')`,
            ...(index === 0 ? {} : {
              top: image.transform.top,
              left: image.transform.left,
              transform: `rotate(${image.transform.rotate}deg) translateZ(${image.transform.z}px)`,
            }),
          };
          return (
            <div
              className={"page " + (imagesState.isSearch ? "hover-opacity" : "")}
              key={index}
              style={style}
              onClick={
                imagesState.isSearch ? () => {
                  setImagesState({
                    ...imagesState,
                    isSearch: false,
                    isMid: true,
                    target: index,
                  })
                } : undefined
              }>
              <div className={"description " + (index === imagesState.current ? "" : "hidden")}>
                <div className="line"><span>Photo Title:</span> {image.title}</div>
                <div className="line"><span>Photographer:</span> {image.photographer}</div>
                <div className="line"><span>Date Taken:</span> {image.date}</div>
                <div className="line"><span>Location:</span> {image.location}</div>
                <div className="line"><span>Description:</span> {image.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Header/>

      <div className="numbers-div">
        <div className="prev" onClick={previous}><ArrowBack/></div>
        <div id="page-numbers">
          {imageTransforms.map((image: any, index: number) => (
            <div
              key={index}
              className={`number number-item ${index === imagesState.current ? "active" : ""}`}
              style={{
                backgroundImage: `url('${image.path}')`,
              }}
              onClick={() => setImagesState({
                ...imagesState,
                target: index,
              })}
            >
              <div className="number-filter-div">{index + 1}</div>
            </div>
          ))}
        </div>
        <div className="next" onClick={next}><ArrowForward/></div>
      </div>

      <div className="search-btn" onClick={search}><Search/></div>
    </Fragment>
  );
}