/* ファミコン風の音の出し方（Web Audio API の見本）
   ブラウザには「音を作る部品」が入っています。
     オシレーター（発振器）… 決まった高さ・波形の音を出しつづける
     ゲイン（音量のつまみ）  … 音の大きさを変える
   この2つをつないで、スピーカー（destination）に流すと、音が鳴ります。 */

var AC = null;
function ac() {                                   // 音の部品を作る「工場」。最初の1回だけ作る
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();      // ブラウザは、ボタンを押すまで音を止めている
  return AC;
}

/* MIDI の音の番号 → 周波数（Hz）。69 が「ラ＝440Hz」。番号が 12 上がると、周波数は2倍（1オクターブ） */
function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

/* 音を1つ鳴らす。 f=周波数, t=鳴らす時刻(秒), d=長さ(秒), type=波形, vol=大きさ(0〜1) */
function note(f, t, d, type, vol) {
  var a = ac(), o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t);                                  // はじめは無音
  g.gain.linearRampToValueAtTime(vol, t + 0.01);                // 0.01秒で一気に大きく（アタック）
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);           // だんだん小さく（ディケイ）
  o.connect(g); g.connect(a.destination);                       // 発振器 → 音量 → スピーカー
  o.start(t); o.stop(t + d + 0.02);
  return o;
}

/* ---- 1) 高さと波形 ---- */
var wave = 'square';
var hzIn = document.getElementById('hz'), hzOut = document.getElementById('hz-out');
hzIn.addEventListener('input', function () { hzOut.textContent = hzIn.value; draw(); });
document.getElementById('waves').addEventListener('click', function (e) {
  var b = e.target.closest('[data-wave]'); if (!b) return;
  wave = b.getAttribute('data-wave');
  [].forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); }); draw();
});
document.getElementById('tone').addEventListener('click', function () { note(+hzIn.value, ac().currentTime, 0.6, wave, 0.15); });

/* 波の形を絵にする（左から右へ 0.01秒ぶん） */
function draw() {
  var cv = document.getElementById('scope'), c = cv.getContext('2d'), W = cv.width, H = cv.height, f = +hzIn.value;
  c.clearRect(0, 0, W, H); c.strokeStyle = '#7df9ff'; c.lineWidth = 2; c.beginPath();
  for (var x = 0; x < W; x++) {
    var p = (x / W * 0.01 * f) % 1, y;            // p は、1回のふるえの中のどこにいるか（0〜1）
    if (wave === 'square') y = p < 0.5 ? 1 : -1;
    else if (wave === 'triangle') y = p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
    else if (wave === 'sawtooth') y = 2 * p - 1;
    else y = Math.sin(p * Math.PI * 2);
    var py = H / 2 - y * H * 0.38; if (x) c.lineTo(x, py); else c.moveTo(x, py);
  }
  c.stroke();
}
draw();

/* ---- 2) ドレミ ---- */
[['ド', 60], ['レ', 62], ['ミ', 64], ['ファ', 65], ['ソ', 67], ['ラ', 69], ['シ', 71], ['ド', 72]].forEach(function (k) {
  var b = document.createElement('button'); b.textContent = k[0]; b.title = Math.round(hz(k[1])) + ' Hz';
  b.addEventListener('click', function () { note(hz(k[1]), ac().currentTime, 0.4, wave, 0.15); });
  document.getElementById('keys').appendChild(b);
});

/* ---- 3) 曲。数字は MIDI の音の番号。0 は休み、-1 は前の音をのばす ---- */
var SONGS = [
  { name: 'あさのさんぽ', bpm: 132,
    lead: [76, 76, 79, 76, 72, 74, 76, -1, 79, 81, 79, 76, 74, 72, 74, -1, 76, 76, 79, 81, 79, 76, 72, 74, 76, 74, 72, 74, 72, -1, -1, 0],
    bass: [48, 55, 48, 55, 53, 60, 53, 60, 57, 64, 57, 64, 55, 62, 55, 62] },
  { name: 'よるのたんけん', bpm: 150,
    lead: [69, 0, 72, 74, 76, -1, 74, 72, 71, -1, 67, 71, 72, -1, 69, -1, 69, 0, 72, 74, 76, 77, 79, -1, 77, 76, 74, 71, 69, -1, -1, 0],
    bass: [45, 57, 45, 57, 41, 53, 41, 53, 43, 55, 43, 55, 40, 52, 40, 52] },
  { name: 'ドレミファソラシド', bpm: 120, lead: [60, 62, 64, 65, 67, 69, 71, 72, 72, 71, 69, 67, 65, 64, 62, 60], bass: [48, 0, 55, 0, 48, 0, 55, 0] }
];
var timer = null;
function stop() { clearInterval(timer); timer = null; [].forEach.call(document.querySelectorAll('#songs button'), function (b) { b.classList.remove('on'); }); }
function play(s, btn) {
  stop(); btn.classList.add('on');
  var a = ac(), step = 60 / s.bpm / 2, k = 0, t = a.currentTime + 0.05;      // step ＝ 8分音符1つの長さ（秒）
  function len(i) { var n = 1; while (s.lead[(i + n) % s.lead.length] === -1) n++; return n; }  // -1 がつづくぶん、長くのばす
  function sched() {                                                          // 少し先（0.3秒）までの音を、先に予約しておく
    while (t < a.currentTime + 0.3) {
      var m = s.lead[k % s.lead.length];
      if (m > 0) note(hz(m), t, step * len(k % s.lead.length) * 0.92, 'square', 0.05);       // メロディ：四角い波
      if (k % 2 === 0) { var b = s.bass[(k / 2) % s.bass.length]; if (b > 0) note(hz(b), t, step * 1.7, 'triangle', 0.1); }  // ベース：三角の波
      t += step; k++;
    }
  }
  sched(); timer = setInterval(sched, 100);
}
SONGS.forEach(function (s) {
  var b = document.createElement('button'); b.textContent = '▶ ' + s.name;
  b.addEventListener('click', function () { play(s, b); }); document.getElementById('songs').appendChild(b);
});
document.getElementById('stop').addEventListener('click', stop);

/* ---- 4) 効果音 ---- */
var FX = {
  click: function () {                             // 雑音（ノイズ）を、ごく短く鳴らす
    var a = ac(), buf = a.createBuffer(1, a.sampleRate * 0.03, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 6);   // でたらめな数 × だんだん小さく
    var s = a.createBufferSource(), g = a.createGain(); s.buffer = buf; g.gain.value = 0.3; s.connect(g); g.connect(a.destination); s.start();
  },
  coin: function () { var t = ac().currentTime; note(hz(83), t, 0.08, 'square', 0.1); note(hz(88), t + 0.08, 0.4, 'square', 0.1); },   // 高い音を2つ、すばやく
  jump: function () {                              // 周波数を、低い → 高い へ すべらせる
    var a = ac(), t = a.currentTime, o = note(220, t, 0.25, 'square', 0.1);
    o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.2);
  },
  boot: function () { var t = ac().currentTime; [72, 76, 79, 84, 88].forEach(function (m, i) { note(hz(m), t + i * 0.08, 0.9, 'triangle', 0.08); }); note(110, t, 1.2, 'sine', 0.15); },
  over: function () { var t = ac().currentTime; [72, 67, 64, 60].forEach(function (m, i) { note(hz(m), t + i * 0.14, 0.24, 'square', 0.08); }); }
};
document.addEventListener('click', function (e) { var b = e.target.closest('[data-fx]'); if (b) FX[b.getAttribute('data-fx')](); });
