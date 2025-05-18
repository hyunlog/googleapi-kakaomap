const { client_email, private_key, spreadsheetId } = require('./credentials.json');
const { google } = require('googleapis');
const axios = require('axios');

require('dotenv').config();

const authorize = new google.auth.JWT(client_email, null, private_key, ['https://www.googleapis.com/auth/spreadsheets']);
const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
});

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

// 구글 시트에 있는 값 읽어오기
const batchGet = async () => {
    const res = await googleSheet.spreadsheets.values.batchGet({
        spreadsheetId,

        ranges : ['CafeList!C122:C142']
    });
    return res.data.valueRanges[0].values;
}

// 구글 시트 업데이트 (지번, x&y 좌표)
const batchUpdate = async (range, values) => {
    await googleSheet.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
            valueInputOption: 'USER_ENTERED',
            data: [
                {
                    range,
                    values: [ values ]
                }
            ]
        }
    });
}

const getGecode = async () => {
    // 도로명 주소
    const roadAddresses = await batchGet();

    try {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for(let i=0; i<roadAddresses .length; i++) {
            const geRes = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
                },
                params: {
                    query: roadAddresses[i].join('')
                }
            });

            const gecodeData = geRes.data.documents;

            if (gecodeData.length === 0) {
                console.log('주소에 대한 좌표를 찾을 수 없습니다.');
                break;
            }

            const { x, y } = gecodeData[0];

            const addressRes = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
                },
                params: { x, y }
            });

            const { documents } = addressRes.data;

            const { address } = documents[0];

            if (documents.length === 0) {
                console.log('주소 정보를 찾을 수 없습니다.');
                break;
            }

            await batchUpdate(`CafeList!D${i+122}:F${i+122}`, [ address.address_name, x, y ]);

            await wait(5000);
        }
    } catch (e) {
        console.log(e);
    }
}

getGecode();