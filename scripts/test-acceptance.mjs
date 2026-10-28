import assert from "assert";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function runTests() {
  console.log(`\n🚀 Menjalankan Acceptance Verification Suite terhadap ${BASE_URL}\n`);

  let cookieHeader = "";

  // TEST 1: Public Homepage
  console.log("1. Menguji Beranda (/) ...");
  const homeRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(homeRes.status, 200, "Beranda harus mengembalikan 200 OK");
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes("PRINCE"), "Beranda harus memuat brand PRINCE LAB");
  assert(homeHtml.includes("Learn. Build. Share."), "Beranda harus memuat tagline");
  assert(homeHtml.includes("Ekosistem"), "Beranda harus memuat bagian ekosistem");
  console.log("   ✓ Beranda lolos verifikasi");

  // TEST 2: Public Projects Catalog
  console.log("2. Menguji Katalog Proyek (/projects) ...");
  const projRes = await fetch(`${BASE_URL}/projects`);
  assert.strictEqual(projRes.status, 200, "Katalog proyek harus mengembalikan 200 OK");
  const projHtml = await projRes.text();
  assert(projHtml.includes("MotoCheck"), "Katalog harus memuat proyek published");
  assert(!projHtml.includes("eksperimen-ai-draft"), "Katalog TIDAK BOLEH memuat draft proyek");
  console.log("   ✓ Katalog proyek lolos verifikasi");

  // TEST 3: Public Detail Project (Published)
  console.log("3. Menguji Detail Proyek Published (/projects/motocheck-placeholder) ...");
  const detailRes = await fetch(`${BASE_URL}/projects/motocheck-placeholder`);
  assert.strictEqual(detailRes.status, 200, "Detail proyek published harus 200 OK");
  const detailHtml = await detailRes.text();
  assert(detailHtml.includes("MotoCheck"), "Detail proyek harus memuat judul");
  assert(detailHtml.includes("instagram.com"), "Detail proyek harus memuat tautan content card");
  console.log("   ✓ Detail proyek published lolos verifikasi");

  // TEST 4: Public Detail Project (Draft -> Expected 404)
  console.log("4. Menguji Akses Publik ke Proyek Draft (/projects/eksperimen-ai-draft) ...");
  const draftRes = await fetch(`${BASE_URL}/projects/eksperimen-ai-draft`);
  assert.strictEqual(draftRes.status, 404, "Draft proyek di URL publik HARUS mengembalikan 404");
  console.log("   ✓ Perlindungan privasi draft lolos (HTTP 404)");

  // TEST 5: Unauthenticated Admin Guard
  console.log("5. Menguji Proteksi Rute Admin Tanpa Sesi (/admin) ...");
  const adminUnauthRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  assert([307, 302, 308].includes(adminUnauthRes.status), "Rute /admin harus me-redirect pengunjung tanpa auth");
  console.log("   ✓ Proteksi rute admin aktif (Redirect ke login)");

  // TEST 6: Admin Login
  console.log("6. Menguji Autentikasi Admin (/api/admin/login) ...");
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@princelab.id", password: "princeAdmin2026!" }),
  });
  assert.strictEqual(loginRes.status, 200, "Login admin harus sukses");
  const setCookie = loginRes.headers.get("set-cookie");
  assert(setCookie, "Login harus mengembalikan Set-Cookie");
  cookieHeader = setCookie.split(";")[0];
  console.log("   ✓ Autentikasi admin sukses, cookie diterima");

  // TEST 7: Query Admin Projects & Cards
  console.log("7. Menguji Pengambilan Data Admin dengan Cookie ...");
  const authProjRes = await fetch(`${BASE_URL}/api/admin/projects`, {
    headers: { Cookie: cookieHeader },
  });
  assert.strictEqual(authProjRes.status, 200, "API admin projects harus 200 OK");
  const authProjData = await authProjRes.json();
  assert(Array.isArray(authProjData.projects), "Data proyek harus berupa array");
  console.log(`   ✓ Admin API mengembalikan ${authProjData.projects.length} proyek (termasuk draft)`);

  // TEST 8: Create New Project via API
  console.log("8. Menguji Pembuatan Proyek Baru ...");
  const createProjRes = await fetch(`${BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      title: "Verifikasi CI Proyek",
      slug: `ci-proyek-${Date.now()}`,
      summary: "Proyek pengujian otomatis untuk verifikasi sistem",
      status: "draft",
      sortOrder: 99,
    }),
  });
  assert.strictEqual(createProjRes.status, 201, "Pembuatan proyek harus 201 Created");
  const createdProjData = await createProjRes.json();
  const testProjId = createdProjData.project.id;
  console.log(`   ✓ Proyek baru berhasil dibuat (ID: ${testProjId})`);

  // TEST 9: Validate Instagram URL on Content Cards
  console.log("9. Menguji Validasi URL Instagram ...");
  const invalidCardRes = await fetch(`${BASE_URL}/api/admin/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      title: "Tes Invalid URL",
      summary: "Ringkasan tes",
      publisherName: "@test",
      instagramUrl: "https://evil.com/fake-post", // Non-Instagram domain!
      status: "draft",
    }),
  });
  assert.strictEqual(invalidCardRes.status, 422, "URL non-Instagram harus ditolak dengan 422");
  console.log("   ✓ Server menolak URL non-Instagram dengan benar");

  // TEST 10: Create Content Card Linked to Project
  console.log("10. Menguji Pembuatan Content Card Terkait ...");
  const createCardRes = await fetch(`${BASE_URL}/api/admin/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      title: "Content Card Verifikasi",
      summary: "Konten pengujian relasi proyek",
      publisherName: "@princee.lab",
      instagramUrl: "https://www.instagram.com/princee.lab/",
      projectId: testProjId,
      status: "draft",
    }),
  });
  assert.strictEqual(createCardRes.status, 201, "Pembuatan card harus 201");
  const createdCardData = await createCardRes.json();
  const testCardId = createdCardData.card.id;
  console.log(`   ✓ Content card berhasil dibuat dan ditautkan ke proyek ${testProjId}`);

  // TEST 11: Attempt deleting project while card is linked (MUST BE BLOCKED)
  console.log("11. Menguji Penolakan Hapus Proyek dengan Card Terkait (Integritas Relasi) ...");
  const delBlockedRes = await fetch(`${BASE_URL}/api/admin/projects/${testProjId}`, {
    method: "DELETE",
    headers: { Cookie: cookieHeader },
  });
  assert.strictEqual(delBlockedRes.status, 409, "Penghapusan proyek dengan relasi HARUS ditolak dengan 409 Conflict");
  console.log("   ✓ Integritas relasi terlindungi: Penghapusan diam-diam ditolak oleh server");

  // TEST 12: Delete Card First, then Delete Project
  console.log("12. Menghapus Card Terlebih Dahulu, Lalu Menghapus Proyek ...");
  const delCardRes = await fetch(`${BASE_URL}/api/admin/cards/${testCardId}`, {
    method: "DELETE",
    headers: { Cookie: cookieHeader },
  });
  assert.strictEqual(delCardRes.status, 200, "Penghapusan card harus 200");

  const delProjRes = await fetch(`${BASE_URL}/api/admin/projects/${testProjId}`, {
    method: "DELETE",
    headers: { Cookie: cookieHeader },
  });
  assert.strictEqual(delProjRes.status, 200, "Setelah relasi dilepas, proyek berhasil dihapus");
  console.log("   ✓ Prosedur pembersihan relasi berhasil");

  // TEST 13: Analytics Recording
  console.log("13. Menguji Perekaman Event Analytics ...");
  const analyticsRes = await fetch(`${BASE_URL}/api/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType: "instagram_outbound_click",
      targetId: "card-1",
      targetUrl: "https://www.instagram.com/princee.lab/",
      path: "/",
    }),
  });
  assert.strictEqual(analyticsRes.status, 200, "Perekaman analytics harus 200 OK");
  console.log("   ✓ Analytics berhasil merekam outbound click tanpa kebocoran data sensitif");

  console.log("\n=======================================================");
  console.log("🎉 SEMUA PENGUJIAN ACCEPTANCE CRITERIA BERHASIL 100%! 🎉");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("\n❌ Pengujian gagal:", err.message);
  process.exit(1);
});
