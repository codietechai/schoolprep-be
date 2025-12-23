// export const firebaseConfig = {
//     type: "service_account",
//     project_id: "test-storage-7acfd",
//     private_key_id: "0b2af6e6fd2ec268a673d9a839df0af175e245f6",
//     private_key:
//       "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCn3WCODVPSAvYQ\nUvNqPHvywKHCdK4EhWCIPWr3l7jNoGM/Bm0/Qg7/jNhk34dnLIIUSxAJ6Bboc6WP\nTT1K2wRZhZCYCX55pRLbdXMwqNk0haK7Qs7j/zgxA9Hn4QhK/a5LY/l3ezM8J6if\nOhbGOLEQFKvCAFhKTR1lCH1+B8sWo+1T16z+O3PYKygJeqD9E/x9jG653ree7Z5f\na/VsV7MV8ykyP9GhQfOAnCa7SrhWte5XLvTF+M2v0kQNuzi4wHuqNLycnMqcXESo\nfxBWc7RTAU4u7MnTC+3rWhnQ6h0fe+Hcz57i3KdQBeAz8o9ic37H913iC5GuwwJW\nPpjdRuP1AgMBAAECggEABJE+RHncsHz6eKTme5sBXQWxwQqPW48iJRgqthQ6PS9i\nfpSsWfQbArKwhpobDeBvpPa1N9fJRnIzFyw+VoWRX5AwnXpl/GWp7C+3aSOxo+oI\n7KMbjFI66KvWb8KMiQx69rvVzf2bqMTZeS+e7q4cieKjbmgM/u83NV20Rb7CNK+e\nLBpcK6oZ+Oz439e5kV3F5e7COuS6SPeuO6cZBvgRnsCeVsgOM3wQbHoq4j6znsOu\n3n90P/b751PWZ8Cx3LLoCfNQKLSfPAIjx9Kl2201b1thVxAey+EHc6ZkZVl32hqY\nUjwDmLkBBPPn/8wKXmRy7aedtZVQyOJlZ8G4ak+IhwKBgQDeOqYB2J8sZJ9f50yB\noiWNRvfnxs4/+JU5NFJKxicT6WnDFMHjn39SDuXAFtM5uuGt5Xt1aR8DIdi6gF95\nFVfGryHl5Y2Q4EuI+hkUCC0JASofUG80gUWFtWp0GylfNCTVWnaD24fNauy3H+Q9\nOwIcDg0gNTbP8e4eYz1IdaASywKBgQDBX8yhpOnVEvuTYEgYvPYNoaISFvxLeb/a\nSxd2nwu2eybsmhjvMo7jgIKwkSUhtAYrUGtkdLiAyhHi0Aempj3j+I77j4nvKG1Q\nnHaKnZwuk4xJJk12HjyDcDjPmKD2ERTN8HxmIH0cOmLvjSvMuF+0ftTqySI6nUsM\n8GEF8CpMPwKBgQCPELS0tY9rle/gXtirEAca15hbV2qKVm9C34Mm7kBUGk1jMKbN\n8m2WF08jhc4/+Sa2u+jqIl27t3t+PYy5N9tFZpPtHAYyQaN/MHsaoVTU2jIS7MZa\nx+pI9QzuaFoPF1OrIszvgFICFZcFIXvfS3DFPOqIVJnP71E7sOnQDyGZVwKBgEan\nxFNDuJS8LOP6iB1R3e25I0jM0T6aq7kNOvOCxXrVoLFO1NGBfaguqpHtVs3rw11M\nMxEvfMLCEqr3K/R+RZrolQXhupqCAP81TDL1x71U+Cs6LY99GMtF09w2fomqUBm3\nRxzhvhT0WHYC9QAGViHTPeTTvQgBtQxzQGA1Ep9tAoGBAMzSZbc7xaWBib3+RI4S\nqW0LT12IEQmexlj1DJLWd4oTRL9LKe7zxtWWPBwcmTuvBNghEPczFsUW8bR+nRnv\nHFZuxaUUv1pzYD3OE80eGNFwn2ep0/87gVXkABaVjx70Ueh5GAjg7A+brl0ojyr2\nJkzVkx2Dh2Joi9PhZTC7/WDx\n-----END PRIVATE KEY-----\n",
//     client_email:
//       "firebase-adminsdk-2b594@test-storage-7acfd.iam.gserviceaccount.com",
//     client_id: "104656158970635189541",
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url:
//       "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2b594%40test-storage-7acfd.iam.gserviceaccount.com",
//     universe_domain: "googleapis.com",
//   };

export const fbServiceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  };
  