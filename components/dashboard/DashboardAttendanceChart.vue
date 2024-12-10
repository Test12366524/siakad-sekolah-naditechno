<script setup lang="ts">
const chartColors = {
  line: {
    hadir: "#00C48C",
    izin: "#FFB400",
    sakit: "#FF4842",
    alpha: "#666CFF",
  },
};

const headingColor =
  "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))";

const labelColor =
  "rgba(var(--v-theme-on-background), var(--v-disabled-opacity))";

const borderColor = "rgba(var(--v-border-color), var(--v-border-opacity))";

const series = [
  {
    name: "Hadir",
    type: "column",
    data: [38, 45, 33, 38, 32, 48, 45, 40, 42, 37, 20, 12],
  },
  {
    name: "Izin",
    type: "column",
    data: [23, 28, 23, 32, 25, 42, 32, 32, 26, 24, 18, 10],
  },
  {
    name: "Alpha",
    type: "column",
    data: [15, 18, 15, 22, 15, 28, 22, 22, 16, 14, 10, 5],
  },
  {
    name: "Sakit",
    type: "column",
    data: [16, 19, 16, 24, 16, 30, 24, 24, 18, 16, 18, 10],
  },
];

const categories = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const attendanceChartDatas = [
  {
    name: "Hadir",
    data: [
      {
        month: "Januari",
        value: 20,
      }, // lanjutkan sampai desember, default nilai 0
    ],
  },
  {
    name: "Izin",
    data: [
      {
        month: "Januari",
        value: 20,
      },
    ],
  },
  {
    name: "Sakit",
    data: [
      {
        month: "Januari",
        value: 20,
      },
    ],
  },
  {
    name: "Alpha",
    data: [
      {
        month: "Januari",
        value: 20,
      },
    ],
  },
];

const shipmentConfig = {
  chart: {
    type: "line",
    stacked: false,
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  markers: {
    size: 5,
    colors: "#fff",
    strokeColors: chartColors.line.izin,
    hover: {
      size: 6,
    },
    borderRadius: 4,
  },
  stroke: {
    curve: "smooth",
    width: [0, 3],
    lineCap: "round",
  },
  legend: {
    show: true,
    position: "bottom",
    markers: {
      width: 8,
      height: 8,
      offsetX: -3,
    },
    height: 40,
    itemMargin: {
      horizontal: 10,
      vertical: 0,
    },
    fontSize: "15px",
    fontFamily: "Inter",
    fontWeight: 400,
    labels: {
      colors: headingColor,
      useSeriesColors: !1,
    },
    offsetY: 10,
  },
  grid: {
    strokeDashArray: 8,
    borderColor,
  },
  colors: [
    chartColors.line.hadir,
    chartColors.line.izin,
    chartColors.line.sakit,
    chartColors.line.alpha,
  ],
  fill: {
    opacity: [1, 1],
  },
  plotOptions: {
    bar: {
      columnWidth: "30%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    tickAmount: 10,
    categories,
    labels: {
      style: {
        colors: labelColor,
        fontSize: "13px",
        fontFamily: "Inter",
        fontWeight: 400,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    tickAmount: 4,
    min: 0,
    max: 50,
    labels: {
      style: {
        colors: labelColor,
        fontSize: "13px",
        fontFamily: "Inter",
        fontWeight: 400,
      },
      formatter(val: string) {
        return `${val}`;
      },
    },
  },
  responsive: [
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 320,
        },
        xaxis: {
          labels: {
            style: {
              fontSize: "10px",
            },
          },
        },
        legend: {
          itemMargin: {
            vertical: 0,
            horizontal: 10,
          },
          fontSize: "13px",
          offsetY: 12,
        },
      },
    },
    {
      breakpoint: 1025,
      options: {
        chart: {
          height: 415,
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
          },
        },
      },
    },
    {
      breakpoint: 982,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "30%",
          },
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 250,
        },
        legend: {
          offsetY: 7,
        },
      },
    },
  ],
};
</script>

<template>
  <VCard>
    <VCardItem
      title="Statistik Kehadiran tahun ini"
      subtitle="Rata-rata kehadiran adalah 50%"
    />

    <VCardText>
      <VueApexCharts
        id="shipment-statistics"
        type="line"
        height="320"
        :options="shipmentConfig"
        :series="series"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";

.v-btn-group--divided .v-btn:not(:last-child) {
  border-inline-end-color: rgba(var(--v-theme-primary), 0.5);
}

#shipment-statistics {
  .apexcharts-legend-text {
    font-size: 15px !important;
    line-height: 22px;
  }

  .apexcharts-legend {
    .apexcharts-legend-series {
      border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
      border-radius: 0.5rem;
      block-size: 75%;
      margin-inline: 8px !important;
      padding-block: 4px;
      padding-inline: 16px;
    }
  }
}
</style>
