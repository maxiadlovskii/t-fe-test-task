/* eslint no-unused-vars: 1 */
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import useFetch from '../hooks';
import generateUrl from '../api/generateUrl';

const ShortenUrlForm = () => {
    const [
        { data, error, isFetching, isFailed, isSuccess },
        triggerGenerateUrl,
    ] = useFetch(generateUrl);
    const [isCopied, setIsCopied] = useState(false);
    const [value, setValue] = useState('');

    const onChange = useCallback(
        ({ target: { value: inputValue } }) => {
            setValue(inputValue);
        },
        [setValue],
    );

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const postData = async () => {
                try {
                    await triggerGenerateUrl({ long_url: value });
                } catch (err) {
                    // console.log(err)
                }
            };
            postData();
        },
        [triggerGenerateUrl, value],
    );
    const errorMessage = useMemo(
        () => isFailed && error.description,
        [isFailed, error],
    );
    const shortUrl = useMemo(() => isSuccess && data.link, [data, isSuccess]);
    useEffect(() => {
        const makeCopy = async () => {
            try {
                await navigator.clipboard.writeText(shortUrl);
                setIsCopied(true);
            } catch (e) {
                setIsCopied(false);
            }
        };
        if (shortUrl) {
            makeCopy();
        }
    }, [shortUrl, setIsCopied]);
    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="shorten">
                Url:
                <input
                    placeholder="Url to shorten"
                    id="shorten"
                    type="text"
                    value={value}
                    onChange={onChange}
                    disabled={isFetching}
                />
            </label>
            <input
                type="submit"
                value="Shorten and copy URL"
                disabled={isFetching}
            />
            {isSuccess && isCopied && (
                <div>
                    <a href={shortUrl} target="_blank" rel="noreferrer">
                        {shortUrl}
                    </a>
                </div>
            )}
            {isFailed && <div>{errorMessage}</div>}
        </form>
    );
};

export default ShortenUrlForm;
