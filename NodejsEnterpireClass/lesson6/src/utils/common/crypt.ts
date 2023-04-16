import bcrypt from 'bcryptjs';

export function crypt(str: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(str, 12, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export function compare(str: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(str, hash, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
