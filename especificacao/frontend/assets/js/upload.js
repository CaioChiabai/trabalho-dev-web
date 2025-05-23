document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('files', document.getElementById('imagem').files[0]);

  const res = await fetch('http://localhost:1337/api/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  document.getElementById('resultado').innerHTML = `<p>Imagem enviada com sucesso:</p><img src="http://localhost:1337${data[0].url}" class="img-thumbnail" style="max-width: 300px;">`;
});
