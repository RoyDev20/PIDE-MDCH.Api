const cv_box = document.getElementById('matrix-box');
const ctx_box = cv_box.getContext('2d');

cv_box.width = window.innerWidth;
cv_box.height = window.innerHeight;

const alphabets = "ꦲꦤꦕꦫꦏꦢꦠꦱꦮꦭꦥꦝꦗꦪꦚꦩꦒꦧꦛꦔ1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

const fontSize = 16;
const cellSize = fontSize * 1.5;
const columns = cv_box.width / cellSize;

const rainDrops = [];

for (let x = 0; x < columns; x++) {
  rainDrops[x] = 1;
}

ctx_box.fillStyle = 'rgb(10, 10, 10)';
ctx_box.fillRect(0,0,cv_box.width,cv_box.height);

const draw = () => {
  ctx_box.fillStyle = 'rgba(10, 10, 10, 0.1)';
  ctx_box.fillRect(0,0,cv_box.width,cv_box.height);
  
  ctx_box.fillStyle = '#0F0';
  ctx_box.font = fontSize + 'px monospace';
  ctx_box.textAlign = 'center';
  
  for (let i = 0; i < rainDrops.length; i++) {
    const text = alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    ctx_box.fillText(text, i * cellSize, rainDrops[i] * cellSize);
    
    if (rainDrops[i] * cellSize > cv_box.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i]++;
  }
};

setInterval(draw,50);




window.addEventListener('devtoolschange', event => {
  if (event.detail.isOpen) {
    // Mostrar el mensaje de advertencia
    document.getElementById('warning').style.display = 'block';
  }
});


console.log(
  "%c¡Detente!",
  "color:red;padding: 5px 10px;font-size: 70px;font-weight: bold;"
   );

   console.log(
    '%cEsta función del navegador está pensada para desarrolladores. Si alguien te indicó que copiaras y pegaras algo aquí para habilitar una función de esta app o para "hackear" la cuenta de alguien, se trata de un fraude. Si lo haces, esta persona podrá acceder a tus datos.',
    "color:#4d4d4d;padding: 5px 10px;font-size: 30px"
     );