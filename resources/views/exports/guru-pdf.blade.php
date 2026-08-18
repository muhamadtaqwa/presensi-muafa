<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Data Guru</title>
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
        <p>Data Guru</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>NIP</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Jabatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($guru as $g)
                <tr>
                    <td>{{ $g->nip ?? '-' }}</td>
                    <td>{{ $g->name }}</td>
                    <td>{{ $g->username }}</td>
                    <td>{{ $g->jabatan ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
