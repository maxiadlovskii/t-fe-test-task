const getAuthHeaders = () => ({
    Authorization: `Bearer ${process.env.REACT_APP_BITLY_AUTHORIZATION_TOKEN}`,
});

export default getAuthHeaders;
