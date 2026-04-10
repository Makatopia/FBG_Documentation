function initZoom() {
    if (typeof mediumZoom === "undefined") {
        return;
    }

    const zoomTargets = Array.from(document.querySelectorAll(".zoom")).filter(
        (element) => !element.hasAttribute("data-medium-zoom-bound")
    );

    if (!zoomTargets.length) {
        return;
    }

    zoomTargets.forEach((element) => {
        element.setAttribute("data-medium-zoom-bound", "true");
    });

    mediumZoom(zoomTargets, {
        margin: 24,
        background: "#242424ee",
    });
}

if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
    document$.subscribe(initZoom);
} else {
    window.addEventListener("DOMContentLoaded", initZoom);
}
