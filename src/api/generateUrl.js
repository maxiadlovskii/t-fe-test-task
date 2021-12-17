import transportService from '../services/transport';
import { BITLY_URL, SHORTEN_SERVICE } from '../constants/apiUrls';
import getDefaultHeaders from '../services/getDefaultHeaders';
import getAuthHeaders from '../services/getAuthHeaders';

const generateUtl = (data) =>
    transportService(`${BITLY_URL}${SHORTEN_SERVICE}`, {
        method: 'POST',
        data,
        headers: {
            ...getDefaultHeaders(),
            ...getAuthHeaders(),
        },
    });

export default generateUtl;
