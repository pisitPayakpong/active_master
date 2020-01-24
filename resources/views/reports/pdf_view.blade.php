<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
 <title>{{ $title }}</title>
 <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
</head>
<body>
  <h1>{{ $title }}</h1>
  <div>
     <table class="table">
      <thead>
        <tr>
        @foreach ($content['col'] as $col)
          <th>{{ $col }}</th>
        @endforeach
        </tr>
      </thead>
      <tbody>
        @foreach ($content['row'] as $row)
          <tr>
          @foreach ($content['col'] as $col)
            <td>{{ $row[$col] }}</td>
          @endforeach
          </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</body>
</body>
</html>