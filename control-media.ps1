Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
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
if ($bestSession -ne $null) {
    $command = $args[0]
    if ($command -eq "play") { Await ($bestSession.TryPlayAsync()) ([bool]) | Out-Null }
    elseif ($command -eq "pause") { Await ($bestSession.TryPauseAsync()) ([bool]) | Out-Null }
    elseif ($command -eq "next") { Await ($bestSession.TrySkipNextAsync()) ([bool]) | Out-Null }
    elseif ($command -eq "prev") { Await ($bestSession.TrySkipPreviousAsync()) ([bool]) | Out-Null }
}
