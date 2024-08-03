function replacePrices(apk) {
  console.log("replacePrices()")
  const elements = document.body.getElementsByTagName("*");
  const regex = /\b\d{1,2}(:\d{2})?\s*kr\/l\b/g;

  for (let element of elements) {
    for (let node of element.childNodes) {
      if (node.nodeType === 3) {  // Node.TEXT_NODE
        let text = node.nodeValue;
        let newText = text.replace(regex, apk);
        if (newText !== text) {
          node.nodeValue = newText;
        }
      }
    }
  }
}

function observeChanges() {
  console.log("observeChanges()")
  const observer = new MutationObserver(() => {
    replacePrices();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function handleUrlChange() {
  console.log("handleUrlChange()")

  const volume = findVolumeElement();
  if (volume) {
    console.log("Found volume element:", volume);
  } else {
    console.log("Volume element not found.");
  }

  const abv = findAbvElement();
  if (abv !== null) {
    console.log("Found ABV:" + abv);
  } else {
    console.log("ABV not found.");
  }

  const price = findPriceElement();
  if (price !== null) 
  {
    console.log("Found price: " + price);
  }
  else {
    console.log("Price not found.");
  }

  const pant = findPantElement();
  if (pant !== null)
  {
    console.log("Found pant: " + pant);
  }
  else 
  {
    console.log("Pant not found.")
  }

  const priceInclPant = pant + price;

  console.log("priceInclPant: " + priceInclPant);

  let apkString = "undefined APK";

  if (volume !== null &&
      abv !== null &&
      price !== null) {
    console.log("nothing null");

    if (price !== priceInclPant) 
    {
      console.log("price !== priceInclPant");
      apkString = (((abv / 100) * volume) / price).toFixed(2) + " APK (" + (((abv / 100) * volume) / (priceInclPant)).toFixed(2) + " APK inkl. pant)";
    }
    else
    {
      console.log("price == priceInclPant");
      apkString = (((abv / 100) * volume) / price).toFixed(2) + " APK";
    }

    console.log(apkString);
    replacePrices(apkString);
  }
  observeChanges();
}

function findVolumeElement() {
  // Start from a known parent element or a broader selection
  const potentialParents = document.querySelectorAll('body > div:nth-child(1) > main > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)');
  
  for (let parent of potentialParents) {
    // Iterate over all children of the parent
    for (let child of parent.children) {
      // Check if the child contains text ending with " ml"
      if (child.textContent.endsWith(' ml')) {
        // Extract the volume value
        const volumeMatch = child.textContent.match(/\d+/);
        if (volumeMatch) {
          // Convert the matched string to a number
          const volume = parseInt(volumeMatch[0], 10);
          return volume;
        }
      }
    }
  }
  
  // Return null if the volume was not found
  return null;
}

function findAbvElement() {
  // Start from a known parent element or a broader selection
  const potentialParents = document.querySelectorAll('body > div:nth-child(1) > main > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)');
  
  for (let parent of potentialParents) {
    // Iterate over all children of the parent
    for (let child of parent.children) {
      // Check if the child contains text ending with "% vol."
      if (child.textContent.endsWith('% vol.')) {
        // Extract the ABV value
        const abvMatch = child.textContent.match(/\d+/);
        if (abvMatch) {
          // Convert the matched string to a number
          const abvRaw = child.textContent.slice(0, -7).replace(',','.');
          console.log("abvRaw: " + abvRaw);
          const abv = parseFloat(abvRaw);
          return abv;
        }
      }
    }
  }
  
  // Return null if the ABV was not found
  return null;
}


function findPriceElement() {
  // Start at body
  const potentialParents = document.querySelectorAll('body > div:nth-child(1) > main > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4)')
  for (let parent of potentialParents) {
    // Iterate over all the children
    for (let child of parent.children) {
      // Check if the child contains what we want.
      if (child.textContent.match(/:/)) {
        const priceMatch = child.textContent.match(/:/);
        if (priceMatch) {
          const priceRaw = child.textContent.replace(':', '.');

          return parseFloat(priceRaw);
        }
      }
    }
  }

  return null;
}

function findPantElement() {
  const potentialParents = document.querySelectorAll('body > div:nth-child(1) > main > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4)');
  for (let parent of potentialParents) {
    for (let child of parent.children) {
      if (child.textContent.match(/pant/)) {
        const pantMatch = child.textContent.match(/pant/);
        if (pantMatch) {
          const pantRaw = child.textContent;
          console.log("pantParsed: " + getPantInt(pantRaw) + " (" + typeof getPantInt(pantRaw) + ")");
          return getPantInt(pantRaw);

        }
      }
    }
  }
  return 0;
}

function getPantInt(text) {
  // Regular expression to match the integer between "+ pant" and "kr"
  const regex = /\b\d+\b(?=.*kr)/;
  
  // Match the integer in the text
  const match = text.match(regex);
  
  // If a match is found, return the matched integer as a number
  if (match) {
    return parseInt(match[0], 10);
  }
  
  // If no match is found, return null
  return null;
}


console.log("Running Alcoholism.js");

let lastUrl = location.href;
new MutationObserver(() => {
    handleUrlChange();
}).observe(document, { subtree: true, childList: true });

handleUrlChange();

