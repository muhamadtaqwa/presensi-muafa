<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Rekap Presensi</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #1B2333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h2 {
            margin: 0;
            color: #0F3D91;
        }

        .header p {
            margin: 5px 0;
            color: #8A93A6;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #0F3D91;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 11px;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #EEF1F8;
            font-size: 11px;
        }

        tr:nth-child(even) {
            background: #F8FAFD;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Presensi Muafa</h2>
        <p>Rekap Presensi Bulan {{ $bulan }} Tahun {{ $tahun }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Jam Datang</th>
                <th>Jam Pulang</th>
                <th>Keterangan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($presensi as $p)
                <tr>
                    <td>{{ $p->tanggal->format('d/m/Y') }}</td>
                    <td>{{ $p->user->name ?? '-' }}</td>
                    <td>{{ $p->jam_datang?->format('H:i:s') ?? '-' }}</td>
                    <td>{{ $p->jam_pulang?->format('H:i:s') ?? '-' }}</td>
                    <td>{{ $p->keterangan ?? '-' }}</td>
                    <td>{{ $p->status }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
