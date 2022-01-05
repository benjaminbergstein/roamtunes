import React, { FC } from "react";
import {
  Box,
  Text,
  Stack,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Flex,
  Alert,
  AlertIcon,
  Button,
  Switch,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";

import { RepeatIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { cacheGet, filters } from "./spotify";

import { useSeeds, useRecommendations, useSetting, useSliders } from "./hooks";

import FilterSlider from "./FilterSlider";
import Item from "./Item";
import Card from "./Card";
import Tooltip, { TooltipParagraph } from "./Tooltip";

const TuneView: FC = () => {
  const [seeds, select, __, ___, resetSeeds] = useSeeds();
  const { recommendations, isValidating } = useRecommendations();
  const [filtersOpen, setFiltersOpen] = useSetting("filtersOpen", true);
  const [sliders, setSliders, clearSliders] = useSliders();
  const [berzerkMode, setBerzerkMode] = useSetting("berzerkMode", false);
  const [berzerkModeEnabled, setBerzerkModeEnabled] = useSetting(
    "berzerModeEnabled",
    false
  );

  React.useEffect(() => {
    if (!berzerkMode) return;
    if (!recommendations?.tracks?.length) return;

    const selection = Math.round(
      Math.random() * recommendations?.tracks?.length
    );
    const track = recommendations.tracks[selection];

    const timeout = setTimeout(() => {
      select(track)();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [berzerkMode, isValidating, recommendations?.tracks?.length]);

  return (
    <>
      <Box>
        <Tooltip id="tune:seeds" label={`Recommendation "Seeds"`}>
          <TooltipParagraph>
            "Seeds" are tracks or artists used to get recommendations. As you
            select additional recommendations below, recommendations will
            update.
          </TooltipParagraph>
          <TooltipParagraph>
            Think of it as "surfing" or "meandering" through recommendations.
          </TooltipParagraph>
          <TooltipParagraph>
            Due to Spotify limitations, only the last 5 selections are used for
            seeding recommendations.
          </TooltipParagraph>
        </Tooltip>
        {seeds.size > 0 && (
          <Flex overflowX="scroll" flex={1}>
            <Stack
              display="flex"
              spacing="2px"
              minHeight="min-content"
              direction="row-reverse"
              align="center"
            >
              {Array.from(seeds)
                .map((uri) => cacheGet(uri))
                .map((item) => (
                  <Item item={item} context="badge" />
                ))}
              <Button
                height="100%"
                mr="10px"
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={resetSeeds}
                leftIcon={<RepeatIcon height="14px" width="14px" />}
              >
                clear
              </Button>
            </Stack>
          </Flex>
        )}
      </Box>
      {berzerkModeEnabled && (
        <FormControl display="flex" alignItems="center">
          <Switch
            isChecked={berzerkMode}
            onChange={() => setBerzerkMode(!berzerkMode)}
            id="berzerk-mode"
            colorScheme="red"
          />
          <FormLabel ml={2} mb={0} htmlFor="berzerk-mode">
            Berzerk mode
          </FormLabel>
        </FormControl>
      )}
      <Card>
        <Button
          width="100%"
          size="xs"
          onClick={() => {
            setFiltersOpen(!filtersOpen);
          }}
          variant="ghost"
        >
          <HStack width="100%" justify="space-between">
            <Text>Filters</Text>
            {filtersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
        </Button>

        {filtersOpen && (
          <>
            {filters.map((filter) => (
              <FilterSlider filter={filter} />
            ))}
            <Box>
              <Button
                onClick={clearSliders}
                colorScheme="red"
                size="xs"
                leftIcon={<RepeatIcon />}
              >
                Clear filters
              </Button>
            </Box>
          </>
        )}
      </Card>
      {isValidating && (
        <VStack
          my="25px"
          spacing="25px"
          borderWidth="1px"
          borderRadius={4}
          p={4}
        >
          <Spinner color="gray.600" />
          <Text fontSize="sm" color="gray.600">
            Updating recs...
          </Text>
        </VStack>
      )}
      {!isValidating && recommendations?.tracks && (
        <>
          <Tooltip id="tune:recommendations-selection" label="Recommendations">
            <TooltipParagraph>
              Click a recommendation below to budge discovery in that direction.
              This will also add that track to your queue.
            </TooltipParagraph>
            <TooltipParagraph>
              To add to a playlist instead, click the hamburger (🍔), above, and
              then click "Settings".
            </TooltipParagraph>
          </Tooltip>
          <VStack>
            {recommendations?.tracks.map((item) => (
              <Item item={item} />
            ))}
          </VStack>
        </>
      )}
    </>
  );
};

export default TuneView;