<?php
$url = "https://www.marmiton.org/recettes/recette-hasard.aspx";
$random = file_get_contents($url);
preg_match_all('#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $random, $match);

$content_explode = explode("\r\n", $random);

foreach ($content_explode as $key => $value)
{
	if (strpos($value, "<title>"))
	{
		$title_key = $key;
	}
	if (strpos($value, "af-diapo-desktop-0_img"))
	{
		$key_img = $key;
	}
	if (strpos($value, "canonical"))
	{
		$key_url = $key;
	}
	if (strpos($value, "Cette recette a reçu"))
	{
		$key_rating = $key;
	}
}

$title = str_replace("<title>", "", $content_explode[$title_key]);
$title = str_replace("</title>", "", $title);
$title = str_replace("		", "", $title);
$title = explode(":", $title);
$title[0] = substr($title[0], 0, -1);
$image = str_replace('src="', "", $content_explode[$key_img+1]);
$image = str_replace('"', "", $image);
$image = str_replace('		', "", $image);
$url = str_replace('" rel="canonical" />', "", $content_explode[$key_url]);
$url = str_replace('<link href="', "", $url);
$avis = str_replace("recette_", "recette-avis_", $url);
$rating = $content_explode[$key_rating+4];
$rating = str_replace('<span class="recipe-reviews-list__review__head__infos__rating__value"> ', "", $rating);
$rating = str_replace('</span>&nbsp;<span class="recipe-reviews-list__review__head__infos__rating__value__fract">/&nbsp;5</span>', "", $rating);
$rating = str_replace('		', "", $rating);

if (!is_numeric($rating))
{
	$rating = "0";
}

echo json_encode(array("image" => $image, "title" => $title[0], "url" => $url, "avis" => $avis, "rating" => $rating . "/5"));
?>
