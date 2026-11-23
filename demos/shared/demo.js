const stage = document.querySelector('.demo-space');
const frame = stage.querySelector('iframe');
const width = Number(frame.width);

function fitFrame() {
  frame.style.transform = `scale(${stage.clientWidth / width})`;
}

fitFrame();
new ResizeObserver(fitFrame).observe(stage);

document.querySelector('.demo-restart').addEventListener('click', () => {
  frame.src = frame.getAttribute('src');
});
