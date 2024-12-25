import React, { useEffect, useState } from 'react';
import { getPasswords } from '../services/api';

function PasswordList() {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    getPasswords()
      .then((response) => setPasswords(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <h2 className="mt-5">Список паролей</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Сервис</th>
            <th>Логин</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((password) => (
            <tr key={password.id}>
              <td>{password.service}</td>
              <td>{password.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PasswordList;
