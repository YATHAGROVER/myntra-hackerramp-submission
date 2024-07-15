"use client";
import { useState, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function Home() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [savedTextures, setSavedTextures] = useState([]);
  const appRef = useRef(null);
  const pixiContainerRef = useRef(null);
  const canvasRef = useRef(null);

  // Effect to handle PIXI application setup
  useEffect(() => {
    let app = new PIXI.Application({
      antialias: true,
      backgroundColor: 0xffffff,
      resizeTo: window,
    });
    app.view.width = 900;
    canvasRef.current = app;
    appRef.current = app;
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.width = "20%";
    container.style.height = "400px";
    container.style.top = "600px";
    container.style.left = "-70px";
    document.body.appendChild(container);
    container.appendChild(app.view);

    let pixiContainer = new PIXI.Container();
    app.stage.addChild(pixiContainer);
    pixiContainerRef.current = pixiContainer;
    // Load base texture
    const loadBaseTexture = async () => {
      const baseTexture = await PIXI.Texture.from("stells.png");
      const baseSprite = new PIXI.Sprite(baseTexture);
      baseSprite.width = 200;
      baseSprite.height = 450;
      baseSprite.anchor.set(0.4);
      baseSprite.position.set(200, 150);
      pixiContainer.addChild(baseSprite);
    };

    const loadBaseTexture1 = async () => {
      const baseTexture1 = await PIXI.Texture.from("jade.png");
      const baseSprite1 = new PIXI.Sprite(baseTexture1);
      baseSprite1.width = 200;
      baseSprite1.height = 450;
      baseSprite1.anchor.set(0.4);
      baseSprite1.position.set(480, 150);
      pixiContainer.addChild(baseSprite1);
    };

    const loadBaseTexture2 = async () => {
      const baseTexture2 = await PIXI.Texture.from("coumba.png");
      const baseSprite2 = new PIXI.Sprite(baseTexture2);
      baseSprite2.width = 200;
      baseSprite2.height = 420;
      baseSprite2.anchor.set(0.4);
      baseSprite2.position.set(780, 150);
      pixiContainer.addChild(baseSprite2);
    };

    // Load item textures
    const loadItemTextures = async () => {
      for (let item of selectedItems) {
        const itemTexture = await PIXI.Texture.from(item.image);
        const itemSprite = new PIXI.Sprite(itemTexture);
        itemSprite.width = 387;
        itemSprite.height = 475;
        itemSprite.position.set(29.5, -20);
        pixiContainer.addChild(itemSprite);
      }
    };
    const loadItemTextures5 = async () => {
      for (let item of recommendedItems) {
        const itemTexture = await PIXI.Texture.from(item.image);
        const itemSprite = new PIXI.Sprite(itemTexture);
        itemSprite.width = 387;
        itemSprite.height = 475;
        itemSprite.position.set(29.5, -20);
        pixiContainer.addChild(itemSprite);
      }
    };

    const loadItemTextures1 = async () => {
      for (let item of selectedItems) {
        const itemTexture1 = await PIXI.Texture.from(item.image);
        const itemSprite1 = new PIXI.Sprite(itemTexture1);
        itemSprite1.width = 357;
        itemSprite1.height = 475;
        itemSprite1.position.set(320.5, -36);
        pixiContainer.addChild(itemSprite1);
      }
    };
    const loadItemTextures4 = async () => {
      for (let item of recommendedItems) {
        const itemTexture1 = await PIXI.Texture.from(item.image);
        const itemSprite1 = new PIXI.Sprite(itemTexture1);
        itemSprite1.width = 357;
        itemSprite1.height = 475;
        itemSprite1.position.set(320.5, -36);
        pixiContainer.addChild(itemSprite1);
      }
    };

    const loadItemTextures2 = async () => {
      for (let item of selectedItems) {
        const itemTexture2 = await PIXI.Texture.from(item.image);
        const itemSprite2 = new PIXI.Sprite(itemTexture2);
        itemSprite2.width = 387.5;
        itemSprite2.height = 475;
        itemSprite2.position.set(605.5, -43);
        pixiContainer.addChild(itemSprite2);
      }
    };
    const loadItemTextures3 = async () => {
      for (let item of recommendedItems) {
        const itemTexture3 = await PIXI.Texture.from(item.image);
        const itemSprite3 = new PIXI.Sprite(itemTexture3);
        itemSprite3.width = 387.5;
        itemSprite3.height = 475;
        itemSprite3.position.set(605.5, -43);
        pixiContainer.addChild(itemSprite3);
      }
    };
    const loadTexture = async (url) => {
      return new Promise((resolve, reject) => {
        const texture = PIXI.Texture.from(url, { crossOrigin: "anonymous" });
        texture.baseTexture.on("loaded", () => resolve(texture));
        texture.baseTexture.on("error", reject);
      });
    };

    // Load base and item textures
    const loadTextures = async () => {
      await loadBaseTexture();
      await loadBaseTexture1();
      await loadBaseTexture2();
      await loadItemTextures();
      await loadItemTextures1();
      await loadItemTextures2();
      await loadItemTextures3();
      await loadItemTextures4();
      await loadItemTextures5();
      return app;
    };

    loadTextures();

    return () => {
      // Clean up PIXI application and container
      app.destroy(true, { children: true });
      const appView = app.view;
      if (document.body.contains(appView)) {
        // Remove PIXI view from DOM if it exists
      }

      canvasRef.current = null;

      appRef.current = null;
      pixiContainerRef.current = null;
    };
  }, [selectedItems, recommendedItems, savedTextures]);
  const saveContainerAsTexture = () => {
    const app = appRef.current;
    const pixiContainer = pixiContainerRef.current;

    const renderTexture = PIXI.RenderTexture.create({
      width: app.view.width,
      height: app.view.height,
    });

    app.renderer.render(pixiContainer, renderTexture);
    const savedTexture = app.renderer.extract.base64(renderTexture);
    const updatedTextures = [...savedTextures, savedTexture];
    setSavedTextures(updatedTextures);
    localStorage.setItem("savedTextures", JSON.stringify(updatedTextures));
  };

  const handleSaveContainer = () => {
    saveContainerAsTexture();
  };

  // Function to handle snapshot capture and download

  // Function to fetch recommendations based on season, occasion, category
  const fetchRecommendations = async (season, occasion, category) => {
    try {
      const res = await fetch(
        `http://localhost:5000/recommend?season=${season}&occasion=${occasion}&category=${category}`
      );
      const data = await res.json();
      const { image_urls, images_base64 } = data;

      const newItems = image_urls.map((url, index) => ({
        id: index,
        image: `data:image/png;base64,${images_base64[index]}`,
        url: `${url}`,
      }));
      setRecommendedItems(newItems);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Render the UI
  return (
    <div>
      <header className="header">
        <h1 className="heading">DRESSING ROOM</h1>
      </header>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width="800"
        height="600"
      />
      <div>
        <div className="">
          <Header
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            fetchRecommendations={fetchRecommendations}
          />
        </div>

        <div className="Container1">
          <h2>Recommended Items</h2>
          <div className="pizza1">
            {recommendedItems.map((item) => (
              <img
                key={item.id}
                src={item.image}
                alt={`Recommended item ${item.id}`}
                className="recommended-image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const OutfitData = [
  {
    id: 1,
    image: "t8.png",
    season: "summer",
    occasion: "casual",
    category: "bottom",
  },
  {
    id: 2,
    image: "t18.png",
    season: "summer",
    occasion: "work",
    category: "bottom",
  },
  {
    id: 3,
    image: "t24.png",
    season: "summer",
    occasion: "party",
    category: "dress",
  },
  {
    id: 4,
    image: "t2.png",
    season: "summer",
    occasion: "casual",
    category: "dress",
  },
  {
    id: 5,
    image: "t17.png",
    season: "winter",
    occasion: "casual",
    category: "top",
  },
  {
    id: 6,
    image: "t16.png",
    season: "winter",
    occasion: "casual",
    category: "top",
  },
  {
    id: 7,
    image: "t15.png",
    season: "summer",
    occasion: "casual",
    category: "top",
  },
  {
    id: 8,
    image: "t14.png",
    season: "summer",
    occasion: "work",
    category: "top",
  },
  {
    id: 9,
    image: "t22.png",
    season: "winter",
    occasion: "casual",
    category: "top",
  },
  {
    id: 10,
    image: "t20.png",
    season: "summer",
    occasion: "casual",
    category: "top",
  },
];

function Header({ selectedItems, setSelectedItems, fetchRecommendations }) {
  const handleSelectItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
    fetchRecommendations(item.season, item.occasion, item.category);
  };

  const handleUnselectItem = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((selectedItem) => selectedItem.id !== item.id)
    );
    // Clear recommended items when unselecting an item
    setRecommendedItems([]);
  };

  return (
    <div>
      <ul className="pizzas">
        {OutfitData.map((item) => (
          <Item
            key={item.id}
            item={item}
            onSelectItem={handleSelectItem}
            onUnselectItem={handleUnselectItem}
            isSelected={selectedItems.some((i) => i.id === item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function Item({ item, onSelectItem, onUnselectItem, isSelected }) {
  const handleButtonClick = () => {
    if (isSelected) {
      onUnselectItem(item);
    } else {
      onSelectItem(item);
    }
  };

  return (
    <div className="Container">
      <li className="pizza">
        <img src={item.image} alt={`Outfit item ${item.id}`} />
        <button onClick={handleButtonClick}>{isSelected ? "x" : "+"}</button>
      </li>
    </div>
  );
}
