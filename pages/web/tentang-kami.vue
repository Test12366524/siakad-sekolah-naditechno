<script setup lang="ts">
const baseUrl = "configuration/tentang-kami";

const formData = ref({
  id: 1,
  created_at: "2025-01-03T07:23:29.518Z",
  updated_at: "2025-01-12T15:10:33.000Z",
  profile_sejarah_title: "Sejarah Singkat MA Miftahul Ulum Bettet Pamekasan",
  profile_sejarah_description:
    "Madrasah Aliyah merupakan sekolah Menengah setara SMA yang berciri khas Agama Islam. Madrasah yang berlokasi di Pondok Pesantren Miftahul Ulum Desa Bettet Kec. Pamekasan Kab. Pamekasan ini memberikan proses pembelajaran full day menyatu dengan kegiatan pondok pesantren sebagai asrama siswa selama masa pendidikan sehingga diharapkan akan menghasilkan lulusan yang mempunyai kemampuan umum dan diniyah. Oleh karenanya, maka semua siswa yang mengenyam pendidikan di MA. Miftahul Ulum harus siap diasramakan (mondok) selama masa pendidikan.\r\n \r\nDi komplek Pondok Pesantren inilah berdiri 4 Madrasah/Sekolah umum yang terdiri dari SDI Miftahul Ulum (ditutup pada tahun 2010 karena suatu hal), MTs. Miftahul Ulum dan MA. Miftahul Ulum serta Universitas Islam Madura (UIM) Pamekasan. Madrasah/Sekolah ini secara berkesinambungan terus berpacu dalam meningkatkan kualitas pelayanan dan pelaksanaan pendidikan, sehingga saat ini telah menjadi salah satu komplek Pondok Pesantren yang lengkap jenjang pendidikannya mulai tingkat dasar sampai perguruan tinggi.\r\n \r\nMA Miftahul Ulum Bettet Pamekasan adalah sekolah menengah atas berciri khas agama islam berbasis pesantren yang bernaung di bawah Yayasan Miftahul Ulum Bettet. Didirikan pada Tahun 1972 yang pada waktu itu menggunakan Kurikulum Ganda perpaduan antara kurikulum pendidikan nasional dan Diniyah kepesantrenan.\r\n \r\nBerdasarkan perkembangannya, sejak Tahun 1991 MA. Miftahul Ulum Bettet dikonsentrasikan pada dua kelembagaan, yaitu Madrasah Aliyah dengan Kurikulum Diniyah Murni (standar kurikulum pesantren) dan Madrasah Aliyah dengan kurikulum nasional (standar kurikulum nasional) yang telah terakreditasi dengan Predikat Baik (B) pada tahun 2006 oleh Kanwil Depag Propinsi Jatim dan pada tahun 2007 sudah mendapatkan Nomor Pokok Sekolah Nasional (NPSN) 20527719 dan pada tahun 2012 dilakukan pemutihan dengan NPSN baru 20584393.\r\n \r\nDalam upaya peningkatan kualitas lembaga pendidikan islam untuk meningkatkan tata kelola dan administrasi lembaga pendidikan maka pada Tahun 2010 Kepala Kantor Kementerian Agama Propinsi Jawa Timur melakukan penyusunan ulang Nomor Statistik Madrasah (NSM) di lingkungan Kementerian Agama Propinsi Jawa Timur sehingga terjadi perubahan NSM pada MA. Miftahul Ulum Bettet Pamekasan berdasarkan keputusan Kepala Kantor Kementerian Agama Propinsi Jawa Timur Nomor Kw.13.4/4/PP.00.6/658/2010 Tanggal 01 Juli 2010 tentang Ijin Operasional Madrasah Aliyah dengan Nomor NSM 131235280021\r\n \r\nSuatu tuntutan dan keniscayaan bahwa sistem pendidikan harus terus meneruskan dikembangkan seiring dengan perkembangan global demi tercapainya tujuan mulya pendidikan menurut undang-undang yaitu mencerdasakan kehidupan bangsa. Oleh karenanya, Dalam rangka meningkatkan mutu pendidikan nasional secara bertahap, terencana, dan terukur sesuai amanat Undang-undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional, BAB XVI Bagian Kedua Pasal 60 tentang Akreditasi, Pemerintah melakukan akreditasi untuk menilai kelayakan program dan/atau satuan pendidikan. Berkaitan dengan hal tersebut, Pemerintah telah menetapkan Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M) dengan Peraturan Mendiknas Nomor 29 Tahun 2005. MA. Miftahul Ulum Bettet pada tahun pelajaran 2010/2011 telah ditetapkan sebagai Sekolah yang terakreditasi dengan predikat baik (B) oleh Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M). Dan pada tahun 2016 direakreditasi ulang oleh BAN-S/M dan telah mendapat predikat Sangat Baik (A).",
  profile_sejarah_image: null,
  profile_visi_misi_title: "Visi Misi",
  profile_visi_misi_description: "",
  profile_visi_misi_image:
    "20250112221033_Screenshot 2025-01-12 at 22.06.34.png",
  profile_sarana_prasana_title: "Sarana Prasarana",
  profile_sarana_prasana_description:
    "1.KANTOR \r\n2.RUANG TU \r\n3.RUANG KEPALA SEKOLAH\r\n4.RUANG LABORTORIUM KOMPUTER PUTRA\r\n5.RUANG LABORTORIUM KOMPUTER PUTRI\r\n6.RUANG LABORATORIUM KIMIA\r\n7.RUANG LABORATORIUM FISIKA\r\n8.RUANG LABORATORIUM BIOLOGI\r\n9.PERPUSTAKAAN PUTRA \r\n10.PERPUSTAKAAN PUTRI\r\n11.RUANG BK PUTRA\r\n12.RUANG BK PUTRI\r\n13.LAPANGAN VOLLY\r\n14.LAPANGAN BADMINTON\r\n15.LAPANGAN SEPAK BOLA\r\n16.KAMAR MANDI PUTRA\r\n17.KAMAR MANDI PUTRI\r\n18.RUANG GURU\r\n19.LAHAN PARKIR\r\n20.RUANG OSIS PUTRA\r\n21.RUANG OSIS PUTRI\r\n22.RUANG MPK PUTRA\r\n23.RUANG MPK PUTRI\r\n24.RUANG IPNU\r\n25.RUANG IPPNU\r\n26.RUANG EKTRAKURIKULER PUTRI\r\n27.AULA LANTAI II\r\n28.AULA LANTAI III\r\n29.RUANG UKS\r\n",
  profile_sarana_prasana_image:
    "20250112221033_Screenshot 2025-01-12 at 22.08.02.png",
  profile_kepala_madrasah_title: "Kepala Madrasah",
  profile_kepala_madrasah_description: "SAMSUL ARIFIN, S.T",
  profile_kepala_madrasah_image: "20250112221033_Kepala Madrasah.png",
  home_statistik_image: null,
  home_statistik_title: "Guru",
  home_statistik_description: "100",
  home_tantang_kami_title: "Tentang",
  home_tantang_kami_description:
    "Selamat datang di Website Official MA Miftahul Ulum Bettet Pamekasan, tempat di mana pendidikan berkualitas dan nilai-nilai Islam berpadu harmonis. Kami berkomitmen untuk membentuk generasi yang berakhlak mulia, cerdas, dan berwawasan luas.",
  home_link_youtube: "hhtps:://yt.com",
  home_ppdb_title: "PPDB",
  home_ppdb_description: "PPDB",
  home_statistik_image2: null,
  home_statistik_title2: "Sarana ",
  home_statistik_description2: "2",
  home_statistik_image3: null,
  home_statistik_title3: "Alumni",
  home_statistik_description3: "3",
  home_statistik_image4: null,
  home_statistik_title4: "Prestasi",
  home_statistik_description4: "4",
  ppdb_reguler_image: "20250108004055_banner-home-desktop.png",
  ppdb_reguler_title: "Reguler",
  ppdb_reguler_description: "Reguler",
  ppdb_image: "20250108004055_banner-home-desktop.png",
  ppdb_title: "PPDB",
  ppdb_description: "PPDB",
  snpdb_image: "20250108004055_banner-home-desktop.png",
  snpdb_title: "SNPDB",
  snpdb_description: "SNPDB",
  pengumuman_ppdb_image: "20250108004055_banner-home-desktop.png",
  pengumuman_ppdb_title: "Pengumuman",
  pengumuman_ppdb_description: "Pengumuman",
  tenaga_kependidikan_image:
    "20250112221033_Screenshot 2025-01-12 at 22.05.04.png",
  tenaga_kependidikan_title: "Struktur Organisasi",
  tenaga_kependidikan_description: "",
  peserta_didik_image: "20250112221033_Komite Madrasah.png",
  peserta_didik_title: "Komite Madrasah",
  peserta_didik_description:
    "Komite Sekolah adalah badan mandiri yang mewadahi peran serta masyarakat dalam rangka meningkatkan mutu, pemerataan, dan efisiensi pengelolaan pendidikan di satuan pendidikan, baik pada pendidikan pra sekolah, jalur pendidikan sekolah maupun jalur pendidi",
});

const previewPhoto = ref({
  profile_sejarah_image: null,
  profile_visi_misi_image: null,
  profile_sarana_prasana_image: null,
  profile_kepala_madrasah_image: null,
  peserta_didik_image: null,
  tenaga_kependidikan_image: null,
  home_statistik_image2: null,
  home_statistik_image3: null,
  home_statistik_image4: null,
  ppdb_reguler_image: null,
  ppdb_image: null,
  snpdb_image: null,
  pengumuman_ppdb_image: null,
  home_statistik_image: null,
});

const fetchData = () => {
  useApi(baseUrl).then(({ data }) => {
    console.log("data", data);
    formData.value = data;
    previewPhoto.value.peserta_didik_image = data.peserta_didik_image
      ? getFileUrl(data.peserta_didik_image)
      : null;
    previewPhoto.value.tenaga_kependidikan_image =
      data.tenaga_kependidikan_image
        ? getFileUrl(data.tenaga_kependidikan_image)
        : null;
    previewPhoto.value.profile_kepala_madrasah_image =
      data.profile_kepala_madrasah_image
        ? getFileUrl(data.profile_kepala_madrasah_image)
        : null;
    previewPhoto.value.profile_sarana_prasana_image =
      data.profile_sarana_prasana_image
        ? getFileUrl(data.profile_sarana_prasana_image)
        : null;
    previewPhoto.value.profile_visi_misi_image = data.profile_visi_misi_image
      ? getFileUrl(data.profile_visi_misi_image)
      : null;
    previewPhoto.value.profile_sejarah_image = data.profile_sejarah_image
      ? getFileUrl(data.profile_sejarah_image)
      : null;
    previewPhoto.value.home_statistik_image = data.home_statistik_image
      ? getFileUrl(data.home_statistik_image)
      : null;
    previewPhoto.value.home_statistik_image2 = data.home_statistik_image2
      ? getFileUrl(data.home_statistik_image2)
      : null;
    previewPhoto.value.home_statistik_image3 = data.home_statistik_image3
      ? getFileUrl(data.home_statistik_image3)
      : null;
    previewPhoto.value.home_statistik_image4 = data.home_statistik_image4
      ? getFileUrl(data.home_statistik_image4)
      : null;
    previewPhoto.value.ppdb_reguler_image = data.ppdb_reguler_image
      ? getFileUrl(data.ppdb_reguler_image)
      : null;
    previewPhoto.value.ppdb_image = data.ppdb_image
      ? getFileUrl(data.ppdb_image)
      : null;
    previewPhoto.value.snpdb_image = data.snpdb_image
      ? getFileUrl(data.snpdb_image)
      : null;
    previewPhoto.value.pengumuman_ppdb_image = data.pengumuman_ppdb_image
      ? getFileUrl(data.pengumuman_ppdb_image)
      : null;
  });
};

const handleUpdate = () => {
  useApi(baseUrl, {
    withNotif: true,
    method: "PUT",
    data: formData.value,
  });
};

onMounted(() => {
  const { user } = useAuthStore();

  useApi(`level/web-tentang-kami/${user.role_id}`).then(({ data }) => {
    if (data == 0) navigateTo("/not-authorized");
  });
  fetchData();
});
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Tentang Kami</VCardTitle>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCardTitle>Sejarah</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.profile_sejarah_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.profile_sejarah_image"
            accept="image/*"
            label="Upload Foto Sejarah (Optional)"
            @change="
              (data) =>
                (previewPhoto.profile_sejarah_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="formData.profile_sejarah_title" label="Judul" />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.profile_sejarah_description"
            label="Description"
          />
        </VCol>
        <VCardTitle>Visi Misi</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.profile_visi_misi_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.profile_visi_misi_image"
            accept="image/*"
            label="Upload Foto Visi Misi (Optional)"
            @change="
              (data) =>
                (previewPhoto.profile_visi_misi_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            v-model="formData.profile_visi_misi_title"
            label="Judul"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.profile_visi_misi_description"
            label="Description"
          />
        </VCol>
        <VCardTitle>Sarana Prasarana</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.profile_sarana_prasana_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.profile_sarana_prasana_image"
            accept="image/*"
            label="Upload Foto Visi Misi (Optional)"
            @change="
              (data) =>
                (previewPhoto.profile_sarana_prasana_image =
                  data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            v-model="formData.profile_sarana_prasana_title"
            label="Judul"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.profile_sarana_prasana_description"
            label="Description"
          />
        </VCol>
        <VCardTitle>Kepala Madrasah</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.profile_kepala_madrasah_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.profile_kepala_madrasah_image"
            accept="image/*"
            label="Upload Foto Visi Misi (Optional)"
            @change="
              (data) =>
                (previewPhoto.profile_kepala_madrasah_image =
                  data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            v-model="formData.profile_kepala_madrasah_title"
            label="Judul"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.profile_kepala_madrasah_description"
            label="Description"
          />
        </VCol>
        <VCardTitle>Komite Madrasah</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.peserta_didik_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.peserta_didik_image"
            accept="image/*"
            label="Upload Foto Visi Misi (Optional)"
            @change="
              (data) =>
                (previewPhoto.peserta_didik_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="formData.peserta_didik_title" label="Judul" />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.peserta_didik_description"
            label="Description"
          />
        </VCol>
        <VCardTitle>Struktur Organisasi</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.tenaga_kependidikan_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.tenaga_kependidikan_image"
            accept="image/*"
            label="Upload Foto Visi Misi (Optional)"
            @change="
              (data) =>
                (previewPhoto.tenaga_kependidikan_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            v-model="formData.tenaga_kependidikan_title"
            label="Judul"
          />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.tenaga_kependidikan_description"
            label="Description"
          />
        </VCol>
        <VDivider />
      </VRow>

      <VRow>
        <VCol cols="12">
          <VCardTitle>Statistik Homepage</VCardTitle>
          <VRow>
            <VCol cols="6">
              <VCol>
                <VCardTitle>Statistik 1</VCardTitle>
                <VCol cols="12">
                  <VImg
                    class="mb-3"
                    rounded
                    border
                    max-height="300"
                    :src="
                      previewPhoto.home_statistik_image ||
                      'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
                    "
                  />
                  <FileInput
                    v-model="formData.home_statistik_image"
                    accept="image/*"
                    label="Upload Foto (Optional)"
                    @change="
                      (data) =>
                        (previewPhoto.home_statistik_image =
                          data.previewImageUrl)
                    "
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_title"
                    label="Judul"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_description"
                    label="Description"
                  />
                </VCol>
              </VCol>
            </VCol>
            <VCol cols="6">
              <VCol>
                <VCardTitle>Statistik 2</VCardTitle>
                <VCol cols="12">
                  <VImg
                    class="mb-3"
                    rounded
                    border
                    max-height="300"
                    :src="
                      previewPhoto.home_statistik_image2 ||
                      'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
                    "
                  />
                  <FileInput
                    v-model="formData.home_statistik_image2"
                    accept="image/*"
                    label="Upload Foto (Optional)"
                    @change="
                      (data) =>
                        (previewPhoto.home_statistik_image2 =
                          data.previewImageUrl)
                    "
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_title2"
                    label="Judul"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_description2"
                    label="Description"
                  />
                </VCol>
              </VCol>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <VCol>
                <VCardTitle>Statistik 3</VCardTitle>
                <VCol cols="12">
                  <VImg
                    class="mb-3"
                    rounded
                    border
                    max-height="300"
                    :src="
                      previewPhoto.home_statistik_image3 ||
                      'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
                    "
                  />
                  <FileInput
                    v-model="formData.home_statistik_image3"
                    accept="image/*"
                    label="Upload Foto (Optional)"
                    @change="
                      (data) =>
                        (previewPhoto.home_statistik_image3 =
                          data.previewImageUrl)
                    "
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_title3"
                    label="Judul"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_description3"
                    label="Description"
                  />
                </VCol>
              </VCol>
            </VCol>
            <VCol cols="6">
              <VCol>
                <VCardTitle>Statistik 4</VCardTitle>
                <VCol cols="12">
                  <VImg
                    class="mb-3"
                    rounded
                    border
                    max-height="300"
                    :src="
                      previewPhoto.home_statistik_image4 ||
                      'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
                    "
                  />
                  <FileInput
                    v-model="formData.home_statistik_image4"
                    accept="image/*"
                    label="Upload Foto (Optional)"
                    @change="
                      (data) =>
                        (previewPhoto.home_statistik_image4 =
                          data.previewImageUrl)
                    "
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_title4"
                    label="Judul"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="formData.home_statistik_description4"
                    label="Description"
                  />
                </VCol>
              </VCol>
            </VCol>
          </VRow>
        </VCol>
        <VDivider />
      </VRow>

      <VRow>
        <VCardTitle>Informasi PPDB</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.ppdb_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.ppdb_image"
            accept="image/*"
            label="Upload Foto (Optional)"
            @change="(data) => (previewPhoto.ppdb_image = data.previewImageUrl)"
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="formData.ppdb_title" label="Judul" />
        </VCol>
        <VCol cols="12">
          <VTextarea v-model="formData.ppdb_description" label="Description" />
        </VCol>
        <VCardTitle>Informasi PPDB Regular</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.ppdb_reguler_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.ppdb_reguler_image"
            accept="image/*"
            label="Upload Foto (Optional)"
            @change="
              (data) => (previewPhoto.ppdb_reguler_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="formData.ppdb_reguler_title" label="Judul" />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.ppdb_reguler_description"
            label="Description"
          />
        </VCol>
        <VCardTitle>SNPDB</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.snpdb_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.snpdb_image"
            accept="image/*"
            label="Upload Foto (Optional)"
            @change="
              (data) => (previewPhoto.snpdb_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="formData.snpdb_title" label="Judul" />
        </VCol>
        <VCol cols="12">
          <VTextarea v-model="formData.snpdb_description" label="Description" />
        </VCol>
        <VCardTitle>Pengumuman PPDB</VCardTitle>
        <VCol cols="12">
          <VImg
            class="mb-3"
            rounded
            border
            max-height="300"
            :src="
              previewPhoto.pengumuman_ppdb_image ||
              'https://placehold.jp/30/fff/555/300x150.png?text=Foto'
            "
          />
          <FileInput
            v-model="formData.pengumuman_ppdb_image"
            accept="image/*"
            label="Upload Foto (Optional)"
            @change="
              (data) =>
                (previewPhoto.pengumuman_ppdb_image = data.previewImageUrl)
            "
          />
        </VCol>
        <VCol cols="12">
          <VTextField v-model="formData.pengumuman_ppdb_title" label="Judul" />
        </VCol>
        <VCol cols="12">
          <VTextarea
            v-model="formData.pengumuman_ppdb_description"
            label="Description"
          />
        </VCol>
      </VRow>
      <div class="d-flex mt-7 mb-3 align-items-center justify-end gap-4">
        <!-- <VBtn color="secondary" @click="reset"> Reset </VBtn> -->
        <VBtn color="primary" @click="handleUpdate"> Save </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
