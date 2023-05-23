import axios from 'axios';

export default function Connection() {
    const url = 'https://temp-qingresso-taxas.onrender.com/temp';
	//const url = 'http://localhost:3000/temp';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}