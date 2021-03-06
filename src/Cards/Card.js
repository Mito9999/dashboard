import React, { useState, useEffect, useContext } from "react";
import { CardWrapper, Title, Data, Icons } from "./style";
import { SITE_INFO } from "../cardFunctions";
import { handleEmptyData, getFromStorage } from "../utils";
import MainContext from "../context";

import { MdRefresh, MdClose } from "react-icons/md";

const Card = ({ cardInfo, removeCard, ...restProps }) => {
    const context = useContext(MainContext);
    const [data, setData] = useState(handleEmptyData("Loading..."));
    const [isLoading, setIsLoading] = useState(true);

    const siteInfo = SITE_INFO[cardInfo.site];

    const getAndSetData = async () => {
        setIsLoading(true);

        const prevData = data;
        try {
            const siteData = await siteInfo.fn(cardInfo);
            setData(siteData);
        } catch (err) {
            console.log(err);
            setData(prevData);
        }

        setTimeout(() => setIsLoading(false), 100); // TEMP FIX for when data is cached, just to show that the click has been registered
    };

    useEffect(() => {
        getAndSetData();
        const refreshIntervalID = setInterval(() => {
            let shouldRefresh = true;

            if (siteInfo.refreshPeriod) {
                const {
                    refreshPeriod: { start, end },
                } = siteInfo;
                const now = new Date();

                const [startHour] = start; // [startHour, startMinute]
                const [endHour] = end; // [endHour, endMinute]
                const currentHour = now.getHours();

                // TODO: Add minute accuracy - check for hour AND minute instead of just hour.
                // TODO: Add support for other time zones.

                // const currentMinute = now.getMinutes();
                // const minuteIsOutOfRange = currentMinute < startMinute && currentMinute > endMinute;

                // console.log(`${currentHour} > ${startHour} && ${currentHour} < ${endHour}`); // For future testing
                const isHourInRange =
                    currentHour > startHour && currentHour < endHour;

                shouldRefresh = isHourInRange;
            }

            if (shouldRefresh && getFromStorage("settings").autoUpdate) {
                getAndSetData();
            }
        }, siteInfo.refreshInterval);

        return () => {
            clearInterval(refreshIntervalID);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (context.refresh.shouldAllCardsRefresh) {
            try {
                console.log("Refreshing:", cardInfo.site);
                getAndSetData();
            } catch {
                console.error("Failed to refresh:", cardInfo.site);
            }
            context.refresh.setShouldAllCardsRefresh(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    return (
        <CardWrapper {...restProps}>
            <Title>{data[0]}</Title>
            <Data>
                <div>{data[1]}</div>
                <div>{data[2]}</div>
            </Data>
            <Icons
                style={{
                    color: context.theme.icons,
                }}
            >
                <MdClose onClick={() => removeCard(cardInfo.id)} />
                <MdRefresh
                    onClick={() => {
                        if (!isLoading) {
                            getAndSetData();
                        }
                    }}
                    className={isLoading ? "refreshing" : ""}
                />
            </Icons>
        </CardWrapper>
    );
};

export default Card;
