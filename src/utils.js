import { saveAs } from "file-saver";

const stringToObjectProperty = (path, obj) => {
    return path
        .split(".")
        .reduce((prev, curr) => (prev ? prev[curr] : null), obj);
};

export const getFromStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

export const saveToStorage = (key, value) => {
    if (typeof value === "string") {
        localStorage.setItem(key, value);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const exportData = (data, name) => {
    const file = new Blob([JSON.stringify(data)], {
        type: "application/json",
        name,
    });

    saveAs(file, name);
};

export const numberToOrdinalSuffix = (number) => {
    // Only returns the suffix, without the number
    const ordinalRules = new Intl.PluralRules("en", {
        type: "ordinal",
    });
    const suffixes = {
        one: "st",
        two: "nd",
        few: "rd",
        other: "th",
    };
    return suffixes[ordinalRules.select(number)];
};

export const numberToAbbreviation = (number) => {
    // Returns the abbreviation with the number
    let newValue = number;
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
        newValue /= 1000;
        suffixNum++;
    }

    newValue = newValue.toPrecision(3);
    newValue += suffixes[suffixNum];

    return newValue;
};

export const submitSearch = (event, searchString, sitesArray) => {
    event.preventDefault();

    try {
        const [prefix] = searchString.match(/^[?|!][^ ]*/);
        const prefixText = prefix.replace(/[?|!]/, "");

        const query = searchString.replace(/[?|!][^ ]* /, "");
        const siteObject = sitesArray.find(
            (site) => site.prefix === prefixText
        );

        siteObject &&
            window.open(
                siteObject.url.replace(/{{query}}/, encodeURI(query)),
                "_blank"
            );
    } catch {
        window.open(
            `https://www.google.com/search?q=${searchString}`,
            "_blank"
        );
    }
};

export const handleEmptyData = (text = "Error", text2 = text, text3 = text) => {
    return [
        <>{text}</>,
        <>
            <div style={{ height: "39px" }}>{text2}</div>
        </>,
        <>
            <div style={{ height: "39px" }}>{text3}</div>
        </>,
    ];
};

export const createCardFunction = (URL, cardInfo, texts) => {
    return (async () => {
        try {
            const data = await fetch(URL);
            const res = await data.json();

            if (Object.values(texts).length !== 2) {
                console.error("Must pass 2 key/value pairs into 'texts'");
            }

            return [
                <>{cardInfo.site}</>,
                <>
                    <span>
                        {stringToObjectProperty(Object.keys(texts)[0], res)}
                    </span>
                    {Object.values(texts)[0]}
                </>,
                <>
                    <span>
                        {stringToObjectProperty(Object.keys(texts)[1], res)}
                    </span>
                    {Object.values(texts)[1]}
                </>,
            ];
        } catch {
            return handleEmptyData();
        }
    })();

    // USAGE:
    // createCardFunction(
    //     "https://ethplorer.io/service/service.php?data=0x5fA22d211D9f8d4Cb094807fF8C468e664f18C97",
    //     cardInfo,
    //     {
    //         "ethPrice.rate": "USD",
    //         balance: "ETH",
    //     }
    // );
};
