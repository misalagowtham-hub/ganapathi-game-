function updateSkyColor() {

    const colourStage =
        Math.floor(distance / 500) % 6;

    if (colourStage === 0) {

        skyColorLayer.style.backgroundColor =
            "rgba(20, 170, 235, 0.88)";

    } else if (colourStage === 1) {

        skyColorLayer.style.backgroundColor =
            "rgba(235, 70, 145, 0.88)";

    } else if (colourStage === 2) {

        skyColorLayer.style.backgroundColor =
            "rgba(45, 190, 95, 0.88)";

    } else if (colourStage === 3) {

        skyColorLayer.style.backgroundColor =
            "rgba(145, 70, 220, 0.88)";

    } else if (colourStage === 4) {

        skyColorLayer.style.backgroundColor =
            "rgba(245, 125, 35, 0.88)";

    } else if (colourStage === 5) {

        skyColorLayer.style.backgroundColor =
            "rgba(20, 185, 175, 0.88)";
    }
}
