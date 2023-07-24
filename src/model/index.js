import axios from 'axios';

export default function Connection() {
    const url = 'https://temp-qingresso-taxas.onrender.com/';
	//const url = 'http://localhost:3000/';

    const conn = axios.create({
        baseURL: url
    })

    return conn;
}