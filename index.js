const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Coldmind Bot API çalışıyor ✅');
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(process.env.SITE_URL + '/?error=no_code');

  try {
    // 1. Token al
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();
    console.log('Token yanıtı:', JSON.stringify(tokenData));

    if (!tokenData.access_token) {
      throw new Error('Token alınamadı: ' + JSON.stringify(tokenData));
    }

    // 2. Kullanıcı bilgisi al
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const user = await userRes.json();
    console.log('Kullanıcı:', user.username);

    // 3. Sunucuya ekle
    const addRes = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: tokenData.access_token })
      }
    );
    console.log('Sunucuya ekleme durumu:', addRes.status);

    // 4. Siteye geri yönlendir
    res.redirect(process.env.SITE_URL + '/?success=true');

  } catch (err) {
    console.error('HATA:', err.message);
    res.redirect(process.env.SITE_URL + '/?error=' + encodeURIComponent(err.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor`);
});
    }

    // 2. Kullanıcı bilgisi al
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const user = await userRes.json();
    console.log('Kullanıcı:', user.username);

    // 3. Sunucuya ekle
    const addRes = await fetch(
      `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: tokenData.access_token })
      }
    );

    console.log('Sunucuya ekleme:', addRes.status);

    // 4. Siteye geri yönlendir
    res.redirect(process.env.SITE_URL + '/?success=true');

  } catch (err) {
    console.error('HATA:', err.message);
    res.redirect(process.env.SITE_URL + '/?error=' + encodeURIComponent(err.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor`);
});
