<?php
// This function cleans up font groups after a font is deleted
function cleanGroupsAfterFontDeletion($deletedFontId, $conn) {
    // Get all font groups
    $query = "SELECT id, font_ids FROM font_groups";
    $result = $conn->query($query);
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $groupId = $row['id'];
            $fontIds = json_decode($row['font_ids'], true);
            
            if (is_array($fontIds)) {
                // Remove the deleted font ID from the array
                $fontIds = array_filter($fontIds, function($fontId) use ($deletedFontId) {
                    return $fontId != $deletedFontId;
                });
                
                // If there are less than 2 fonts left, delete the group
                if (count($fontIds) < 2) {
                    $deleteQuery = "DELETE FROM font_groups WHERE id = $groupId";
                    $conn->query($deleteQuery);
                } else {
                    // Otherwise update the group with the new font IDs
                    $newFontIds = json_encode(array_values($fontIds));
                    $updateQuery = "UPDATE font_groups SET font_ids = '$newFontIds' WHERE id = $groupId";
                    $conn->query($updateQuery);
                }
            }
        }
    }
    
    return true;
}
?>

