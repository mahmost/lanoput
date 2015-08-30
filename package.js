Package.describe({
  name: "mahmost:lanoput",
  git: "https://github.com/mahmost/lanoput.git",
  summary: "Change input language of input/textarea automatically to comply with the element lang attribute",
  "version": "0.2.1"
});
Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.addFiles('lanoput.js', 'client');
  api.addFiles('lanoput.ar.js', 'client');
  api.addFiles('lanoput.fa.js', 'client');
});

