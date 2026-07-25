Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$managerType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType=WindowsRuntime]
$manager = Await ($managerType::RequestAsync()) ($managerType)
$sessions = $manager.GetSessions()
$bestSession = $null
foreach ($s in $sessions) {
    $appId = $s.SourceAppUserModelId
    if ($appId -match "Telegram") { continue }
    $status = $s.GetPlaybackInfo().PlaybackStatus
    if ($status -eq 'Playing') { $bestSession = $s; break }
    if (-not $bestSession) { $bestSession = $s }
}
$session = $bestSession
if ($session -ne $null) {
    $propsType = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType=WindowsRuntime]
    $props = Await ($session.TryGetMediaPropertiesAsync()) ($propsType)
    $status = $session.GetPlaybackInfo().PlaybackStatus
    $timeline = $session.GetTimelineProperties()
    $pos = [Math]::Round($timeline.Position.TotalSeconds)
    $end = [Math]::Round($timeline.EndTime.TotalSeconds)
    $thumbBase64 = ""
    if ($props.Thumbnail -ne $null) {
        $winrtStream = Await ($props.Thumbnail.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
        $size = [uint32]$winrtStream.Size
        if ($size -gt 0) {
            $buffer = New-Object Windows.Storage.Streams.Buffer $size
            $ibuffer = Await ($winrtStream.ReadAsync($buffer, $size, [Windows.Storage.Streams.InputStreamOptions]::None)) ([Windows.Storage.Streams.IBuffer])
            $bytes = [System.Runtime.InteropServices.WindowsRuntime.WindowsRuntimeBufferExtensions]::ToArray($ibuffer)
            $thumbBase64 = [System.Convert]::ToBase64String($bytes)
        }
    }
    Write-Output "$($props.Title)|$($props.Artist)|$status|$pos|$end|$thumbBase64"
} else {
    Write-Output "none|none|0|0|0|"
}
